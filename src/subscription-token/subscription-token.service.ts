import { Injectable } from '@nestjs/common';
import { InjectMapper } from 'automapper-nestjs';
import {
  DeleteResult,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { NullableType } from '../utils/types/nullable.type';
import { Mapper } from 'automapper-core';
import { CreateSubscriptionTokenDto } from '@/domains/subscription-token/create-subscription-token.dto';
import { SubscriptionTokenEntity } from './entities/subscription-token.entity';
import { CompanyService } from '../company/company.service';
import { TokenCategoryService } from '../token-category/token-category.service';
import { TenantAwareRepository } from '../utils/repository/tenant-aware/tenant-aware.repository';
import { subscriptionTokenPaginationConfig } from './config/subscription-token-pagination-config';
import { InjectTenantAwareRepository } from '../utils/repository/tenant-aware/inject-tenant-aware-repository.decorator';

@Injectable()
export class SubscriptionTokenService {
  constructor(
    @InjectTenantAwareRepository(SubscriptionTokenEntity)
    private readonly subscriptionTokenRepository: TenantAwareRepository<SubscriptionTokenEntity>,
    private readonly companyService: CompanyService,
    private readonly tokenCategoryService: TokenCategoryService,
    //private readonly notificationService: NotificationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  async create(
    createSubscriptionTokenDto: CreateSubscriptionTokenDto,
  ): Promise<SubscriptionTokenEntity> {
    const subscriptionToken =
      this.subscriptionTokenRepository.createTenantContext();
    subscriptionToken.company = await this.companyService.findOneOrFail({
      id: createSubscriptionTokenDto.companyId,
    });
    subscriptionToken.category = await this.tokenCategoryService.findOneOrFail({
      id: createSubscriptionTokenDto.categoryId,
    });
    return this.subscriptionTokenRepository.saveTenantContext(
      subscriptionToken,
    );
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<SubscriptionTokenEntity>> {
    return await this.subscriptionTokenRepository.paginateTenantContext(
      query,
      this.subscriptionTokenRepository,
      subscriptionTokenPaginationConfig,
    );
  }

  /*  async findAllMe(
    userJwtPayload: JwtPayloadType,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<SubscriptionTokenEntity>> {
    const queryBuilder = this.subscriptionTokenRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.reservation', 'reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .where('user.id = :id', { id: userJwtPayload.id });

    return await paginate<SubscriptionTokenEntity>(
      query,
      queryBuilder,
      subscriptionTokenPaginationConfig,
    );
  }*/

  async findOne(
    fields: FindOptionsWhere<SubscriptionTokenEntity>,
    relations?: FindOptionsRelations<SubscriptionTokenEntity>,
    select?: FindOptionsSelect<SubscriptionTokenEntity>,
  ): Promise<NullableType<SubscriptionTokenEntity>> {
    return await this.subscriptionTokenRepository.findOneTenantContext(
      fields,
      relations,
      select,
    );
  }

  async findOneOrFail(
    fields: FindOptionsWhere<SubscriptionTokenEntity>,
    relations?: FindOptionsRelations<SubscriptionTokenEntity>,
    select?: FindOptionsSelect<SubscriptionTokenEntity>,
  ): Promise<SubscriptionTokenEntity> {
    return await this.subscriptionTokenRepository.findOneOrFailTenantContext(
      fields,
      relations,
      select,
    );
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.subscriptionTokenRepository.delete(id);
  }
}
