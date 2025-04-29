import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { notificationsPaginationConfig } from './config/notifications-pagination.config';
import { NullableType } from '../utils/types/nullable.type';
import { UsersService } from '../users/users.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { WinstonLoggerService } from 'src/logger/winston-logger.service';
import {
  GraphileWorkerListener,
  OnWorkerEvent,
  WorkerService,
} from 'nestjs-graphile-worker';
import { WorkerEventMap } from 'graphile-worker';
import { NotificationJobPayload } from './interfaces/notification-job-payload';
import { NotificationEnum } from '@/enums/notification.enum';
import {
  CreateNotificationDto,
  ReceiverDto,
} from '@/domains/notification/create-notification.dto';
import { NotificationMessageDto } from '@/domains/notification/notification-message.dto';
import { UpdateNotificationDto } from '@/domains/notification/update-notification.dto';
import { NotificationRecipientEntity } from './entities/notification-recipient.entity';
import { notificationsRecipientPaginationConfig } from './config/notifications-recipient-pagination.config';

@Injectable()
@GraphileWorkerListener()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationsRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationRecipientEntity)
    private notificationRecipientRepository: Repository<NotificationRecipientEntity>,
    private readonly usersService: UsersService,
    private readonly logger: WinstonLoggerService,
    private readonly graphileWorker: WorkerService,
  ) {}

  @OnWorkerEvent('job:success')
  async onJobSuccess({ job }: WorkerEventMap['job:success']) {
    this.logger.debug(`job #${job.id} finished`, job);
    this.logger.info(`job #${job.id} finished`, {
      data: job,
    });
    const payload = job.payload as NotificationJobPayload;
    if (job?.task_identifier === 'notification') {
      await this.createNotificationRecipient(payload.notificationId);
    }
  }

  @OnWorkerEvent('job:error')
  onJobError({ job, error }: WorkerEventMap['job:error']) {
    this.logger.error(`job #${job.id} fail ${JSON.stringify(error)}`);
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    this.logger.info(`create-Notification`, {
      description: `Create a new Notification`,
      class: NotificationService.name,
      function: 'create',
    });

    const notification = this.notificationsRepository.create(
      createNotificationDto as DeepPartial<NotificationEntity>,
    );

    const savedNotification =
      await this.notificationsRepository.save(notification);

    if (savedNotification.typeOfSending === NotificationEnum.IMMEDIATELY) {
      await this.sendImmediateNotification(savedNotification);
    }
    if (savedNotification.typeOfSending === NotificationEnum.PUNCTUAL) {
      await this.sendPunctualNotification(savedNotification);
    }
    return savedNotification;
  }

  async findAllPaginated(
    query: PaginateQuery,
  ): Promise<Paginated<NotificationEntity>> {
    this.logger.info(`find-All-Paginated-Notification`, {
      description: `find All Paginated Notification`,
      class: NotificationService.name,
      function: 'findAllPaginated',
    });
    return await paginate(
      query,
      this.notificationsRepository,
      notificationsPaginationConfig,
    );
  }

  async findAllByDay(): Promise<
    (NotificationEntity & { scheduled_date: Date })[]
  > {
    this.logger.info(`find-All-By-Day-Notification`, {
      description: `find All By Day Notification`,
      class: NotificationService.name,
      function: 'findAllByDay',
    });

    const currentDayOfWeek = new Date().getUTCDay(); // 0 (Sunday) to 6 (Saturday)
    return await this.notificationsRepository.query(
      `SELECT *
       FROM notification,
            unnest(notification.scheduled_notification) AS scheduled_date
       WHERE EXTRACT(DOW FROM scheduled_date) = $1
         AND notification.active = true`,
      [currentDayOfWeek],
    );
  }

  async findAllMyNotifications(
    user: JwtPayloadType,
    query: PaginateQuery,
  ): Promise<Paginated<NotificationRecipientEntity>> {
    const stopWatching = this.logger.watch(
      'notification-findAllMyNotifications',
      {
        description: `find All My Notifications`,
        class: NotificationService.name,
        function: 'findAllMyNotifications',
      },
    );

    const queryBuilder = this.notificationRecipientRepository
      .createQueryBuilder('notification-recipient')
      .leftJoinAndSelect('notification-recipient.user', 'user')
      .where('user.id = :userId', { userId: user.id });
    const notifications = await paginate(
      query,
      queryBuilder,
      notificationsRecipientPaginationConfig,
    );
    stopWatching();
    return notifications;
  }

  async findOne(
    fields: FindOptionsWhere<NotificationEntity>,
    relations?: FindOptionsRelations<NotificationEntity>,
  ): Promise<NullableType<NotificationEntity>> {
    this.logger.info(`find-one-Notifications`, {
      description: `find one Notifications`,
      class: NotificationService.name,
      function: 'findOne',
    });
    return await this.notificationsRepository.findOne({
      where: fields,
      relations: relations,
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<NotificationEntity>,
    relations?: FindOptionsRelations<NotificationEntity> | string[],
  ): Promise<NotificationEntity> {
    this.logger.info(`find-one-Or-Fail-Notifications`, {
      description: `find one Or Fail Notifications`,
      class: NotificationService.name,
      function: 'findOneOrFail',
    });
    return await this.notificationsRepository.findOneOrFail({
      where: fields,
      relations: relations,
    });
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationEntity> {
    this.logger.info(`update-Notification`, {
      description: `update Notification`,
      class: NotificationService.name,
      function: 'update',
    });
    const notification = await this.findOneOrFail({ id });
    Object.assign(notification, updateNotificationDto);

    return await this.notificationsRepository.save(notification);
  }

  async remove(id: string): Promise<DeleteResult> {
    this.logger.info(`remove-Notification`, {
      description: `remove Notification`,
      class: NotificationService.name,
      function: 'remove',
    });
    return await this.notificationsRepository.delete(id);
  }

  async sendImmediateNotification(notification: NotificationEntity) {
    const message = await this.createNotificationMessage(notification);
    await this.graphileWorker.addJob(
      'notification',
      {
        message: message,
        notificationId: notification.id,
      },
      {
        maxAttempts: 3,
      },
    );
  }

  async sendPunctualNotification(notification: NotificationEntity) {
    const message = await this.createNotificationMessage(notification);
    await this.graphileWorker.addJob(
      'notification',
      {
        message: message,
        notificationId: notification.id,
      },
      {
        maxAttempts: 3,
        runAt: new Date(notification.punctualSendDate as Date),
      },
    );
  }

  async sendProgrammedNotifications(notificationId: string, sendAt: Date) {
    const notification = await this.findOneOrFail({ id: notificationId });
    const message = await this.createNotificationMessage(notification);

    await this.graphileWorker.addJob(
      'notification',
      {
        message: message,
        notificationId: notificationId,
      },
      {
        maxAttempts: 1,
        runAt: new Date(sendAt),
      },
    );
  }

  async createNotificationRecipient(notificationId: string) {
    const notification = await this.findOneOrFail({ id: notificationId });
    const users = await this.handleNotificationRecipients(notification);
    return await this.notificationRecipientRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const notificationRecipients = users.map((user) => {
          const notificationRecipient = new NotificationRecipientEntity();
          notificationRecipient.notification = notification;
          notificationRecipient.receivers = user;
          return notificationRecipient;
        });
        await entityManager
          .createQueryBuilder()
          .insert()
          .into(NotificationRecipientEntity)
          .values(notificationRecipients)
          .execute();
        // Update isNotificationSent in the Notification entity
        notification.isNotificationSent = true;
        await entityManager.save(Notification, notification);
      },
    );
  }

  async createNotificationMessage(
    notification: NotificationEntity,
  ): Promise<NotificationMessageDto> {
    const tokens = await this.extractNotificationRecipientsTokens(notification);

    return new NotificationMessageDto({
      notification: {
        title: notification.title,
        body: notification.message || 'default message',
      },
      data: {
        title: notification.title,
        message: notification.message || 'default message',
        notify_type: 'adminNotify',
      },
      tokens: tokens,
    });
  }

  async extractNotificationRecipientsTokens(
    notification: NotificationEntity,
  ): Promise<string[]> {
    if (!notification.forAllUsers) {
      return notification.receivers
        .map((item) => item.notificationToken)
        .filter((token) => token !== null) as string[];
    }
    return await this.usersService.findAllUsersToken();
  }

  async handleNotificationRecipients(
    notification: NotificationEntity,
  ): Promise<ReceiverDto[]> {
    if (!notification.forAllUsers) {
      return notification.receivers;
    }
    return await this.usersService.findAllReceivers();
  }
}
