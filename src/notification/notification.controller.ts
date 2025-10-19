import { WinstonLoggerService } from '../logger/winston-logger.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { NotificationEntity } from './entities/notification.entity';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from '@automapper/core';
import { notificationsPaginationConfig } from './config/notifications-pagination.config';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { notificationsRecipientPaginationConfig } from './config/notifications-recipient-pagination.config';
import { NotificationRecipientEntity } from './entities/notification-recipient.entity';
import { NotificationRecipientDto } from './dto/notification-recipient.dto';
import { AuthRequest } from '../utils/types/auth-request.type';
import { DeleteResult } from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: WinstonLoggerService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Post()
  @UseInterceptors(MapInterceptor(NotificationEntity, NotificationDto))
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    return await this.notificationService.create(createNotificationDto);
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    MapInterceptor(NotificationEntity, NotificationDto, { isArray: true }),
  )
  @ApiPaginationQuery(notificationsPaginationConfig)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<NotificationEntity, NotificationDto>> {
    const notifications =
      await this.notificationService.findAllPaginated(query);
    return new PaginatedDto<NotificationEntity, NotificationDto>(
      this.mapper,
      notifications,
      NotificationEntity,
      NotificationDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Get('all/_me')
  @HttpCode(HttpStatus.OK)
  @ApiPaginationQuery(notificationsRecipientPaginationConfig)
  async findAllMyNotifications(
    @Request() request: AuthRequest,
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedDto<NotificationRecipientEntity, NotificationRecipientDto>
  > {
    const notifications = await this.notificationService.findAllMyNotifications(
      request.user,
      query,
    );
    return new PaginatedDto<
      NotificationRecipientEntity,
      NotificationRecipientDto
    >(
      this.mapper,
      notifications,
      NotificationRecipientEntity,
      NotificationRecipientDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Get(':id')
  @UseInterceptors(MapInterceptor(NotificationEntity, NotificationDto))
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<NotificationEntity>> {
    return await this.notificationService.findOne({ id });
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(NotificationEntity, NotificationDto))
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationEntity> {
    return await this.notificationService.update(id, updateNotificationDto);
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.notificationService.remove(id);
  }
}
