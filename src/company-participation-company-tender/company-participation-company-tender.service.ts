import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Not,
  Repository,
} from 'typeorm';
import { FilesService } from '../files/files.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { NullableType } from '../utils/types/nullable.type';
import { CompanyParticipationCompanyTenderEntity } from './entities/company-participation-company-tender.entity';
import { CreateCompanyParticipationUserTenderDto } from '../company-participation-user-tender/dto/create-company-participation-user-tender.dto';
import { UsersTenantService } from '../users-tenant/users-tenant.service';
import { UpdateCompanyParticipationUserTenderDto } from '../company-participation-user-tender/dto/update-company-participation-user-tender.dto';
import { RequestStatusEnum } from '@/enums/request-status.enum';
import {
  CreateNotificationDto,
  ReceiverDto,
} from '../notification/dto/create-notification.dto';
import { NotificationEnum } from '@/enums/notification.enum';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { NotificationService } from '../notification/notification.service';
import { UserTenderEntity } from '../user-tender/entities/user-tender.entity';
import { CompanyTenderService } from 'src/company-tender/company-tender.service';
import { companyParticipationCompanyTenderPaginationConfig } from './config/company-participation-company-tender-pagination-config';
import { CompanyPublicService } from '../company/public/company-public.service';

@Injectable()
export class CompanyParticipationCompanyTenderService {
  constructor(
    @InjectRepository(CompanyParticipationCompanyTenderEntity)
    private readonly tenderParticipationRepository: Repository<CompanyParticipationCompanyTenderEntity>,
    private readonly companyTenderService: CompanyTenderService,
    private readonly usersTenantService: UsersTenantService,
    private readonly companyService: CompanyPublicService,
    private readonly filesService: FilesService,
    private readonly notificationService: NotificationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    tenderId: string,
    companyId: string,
    createTenderParticipationDto: CreateCompanyParticipationUserTenderDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyParticipationCompanyTenderEntity> {
    const participation = this.tenderParticipationRepository.create(
      createTenderParticipationDto as DeepPartial<CompanyParticipationCompanyTenderEntity>,
    );
    participation.tender = await this.companyTenderService.findOneOrFail({
      id: tenderId,
    });
    participation.company = await this.companyService.findOneOrFail({
      id: companyId,
    });
    participation.creator = await this.usersTenantService.findOneOrFail({
      id: userJwtPayload.id,
    });
    if (files) {
      participation.documents =
        await this.filesService.uploadMultipleFiles(files);
    }
    return await this.tenderParticipationRepository.save(participation);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<CompanyParticipationCompanyTenderEntity>> {
    return await paginate<CompanyParticipationCompanyTenderEntity>(
      query,
      this.tenderParticipationRepository,
      companyParticipationCompanyTenderPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ): Promise<Paginated<CompanyParticipationCompanyTenderEntity>> {
    const queryBuilder = this.tenderParticipationRepository
      .createQueryBuilder('participation')
      .leftJoinAndSelect('participation.creator', 'creator')
      .leftJoinAndSelect('participation.tender', 'tender')
      .leftJoinAndSelect('participation.company', 'company')
      .where('creator.id = :id', { id: userJwtPayload.id });
    return await paginate<CompanyParticipationCompanyTenderEntity>(
      query,
      queryBuilder,
      companyParticipationCompanyTenderPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<CompanyParticipationCompanyTenderEntity>,
    relations?: FindOptionsRelations<CompanyParticipationCompanyTenderEntity>,
  ): Promise<NullableType<CompanyParticipationCompanyTenderEntity>> {
    return await this.tenderParticipationRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CompanyParticipationCompanyTenderEntity>,
    relations?: FindOptionsRelations<CompanyParticipationCompanyTenderEntity>,
  ): Promise<CompanyParticipationCompanyTenderEntity> {
    return await this.tenderParticipationRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTenderParticipationDto: UpdateCompanyParticipationUserTenderDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyParticipationCompanyTenderEntity> {
    const participation = await this.findOneOrFail({ id });
    const { deleteImages, ...filteredTenderParticipation } =
      updateTenderParticipationDto;
    Object.assign(participation, filteredTenderParticipation);
    if (deleteImages) {
      await this.filesService.deleteMultipleFiles(deleteImages);
    }
    if (files) {
      participation.documents =
        await this.filesService.uploadMultipleFiles(files);
    }
    return await this.tenderParticipationRepository.save(participation);
  }

  async approve(id: string) {
    await this.tenderParticipationRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Step 1: Find the applicant to get the related participation ID
        const participation = await entityManager.findOneOrFail(
          CompanyParticipationCompanyTenderEntity,
          {
            where: { id },
            relations: { creator: true, tender: true, company: true },
          },
        );

        // Step 2: Approve the selected applicant and send accept notification
        participation.status = RequestStatusEnum.ACCEPTED;
        await entityManager.save(participation);
        if (participation.creator.notificationsToken) {
          const approvedTenant = new ReceiverDto();
          approvedTenant.id = participation.creator.id;
          approvedTenant.notificationToken =
            participation.creator?.notificationsToken ?? null;
          approvedTenant.name = participation.creator.firstName;
          const createNotificationDto = new CreateNotificationDto({
            title: 'Your offer has been Accepted',
            message: `${participation.creator.firstName} accepted your request.`,
            forAllUsers: false,
            receivers: [approvedTenant],
            typeOfSending: NotificationEnum.IMMEDIATELY,
          });
          await this.notificationService.create(createNotificationDto);
        }
        // Step 3: Reject all other applicants with the same tender
        await entityManager.update(
          CompanyParticipationCompanyTenderEntity,
          {
            tender: { id: participation.tender.id },
            id: Not(id),
          },
          {
            status: RequestStatusEnum.REJECTED,
          },
        );

        // Step 4: Update the tender status to active = false
        await entityManager.update(UserTenderEntity, participation.tender.id, {
          active: false,
        });
      },
    );
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tenderParticipationRepository.delete(id);
  }
}
