import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Paginate, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { NullableType } from '../utils/types/nullable.type';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { UserRequestOfferEntity } from './entities/user-request-offer.entity';
import { CompanyOfferService } from '../company-offer/company-offer.service';
import { UsersService } from '../users/users.service';
import { CreateUserRequestOfferDto } from './dto/create-user-request-offer.dto';
import { UsersTenantService } from '../users-tenant/users-tenant.service';
import { userRequestOfferPaginationConfig } from './config/user-request-offer-pagination-config';
import { UpdateUserRequestOfferDto } from './dto/update-user-request-offer.dto';

@Injectable()
export class UserRequestOfferService {
  constructor(
    @InjectRepository(UserRequestOfferEntity)
    private readonly userRequestOfferRepository: Repository<UserRequestOfferEntity>,
    private readonly companyOfferService: CompanyOfferService,
    private readonly userService: UsersService,
    private readonly userTenantService: UsersTenantService,
    //private readonly notificationService: NotificationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    offerId: string,
    createUserRequestOfferDto: CreateUserRequestOfferDto,
  ): Promise<UserRequestOfferEntity> {
    const requestOffer = this.userRequestOfferRepository.create(
      createUserRequestOfferDto as DeepPartial<UserRequestOfferEntity>,
    );
    requestOffer.offer = await this.companyOfferService.findOneOrFail({
      id: offerId,
    });
    requestOffer.creator = await this.userService.findOneOrFail({
      id: userJwtPayload.id,
    });
    return this.userRequestOfferRepository.save(requestOffer);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<UserRequestOfferEntity>> {
    return await paginate<UserRequestOfferEntity>(
      query,
      this.userRequestOfferRepository,
      userRequestOfferPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<UserRequestOfferEntity>> {
    const queryBuilder = this.userRequestOfferRepository
      .createQueryBuilder('requestOffer')
      .leftJoinAndSelect('requestOffer.offer', 'offer')
      .leftJoinAndSelect('requestOffer.creator', 'creator')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate<UserRequestOfferEntity>(
      query,
      queryBuilder,
      userRequestOfferPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<UserRequestOfferEntity>,
    relations?: FindOptionsRelations<UserRequestOfferEntity>,
  ): Promise<NullableType<UserRequestOfferEntity>> {
    return await this.userRequestOfferRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<UserRequestOfferEntity>,
    relations?: FindOptionsRelations<UserRequestOfferEntity>,
  ): Promise<UserRequestOfferEntity> {
    return await this.userRequestOfferRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    id: string,
    updateUserRequestOfferDto: UpdateUserRequestOfferDto,
  ): Promise<UserRequestOfferEntity> {
    const requestOffer = await this.findOneOrFail({ id });
    Object.assign(requestOffer, updateUserRequestOfferDto);
    requestOffer.answerer = await this.userTenantService.findOneOrFail({
      id: userJwtPayload.id,
    });
    return await this.userRequestOfferRepository.save(requestOffer);
  }

  async remove(id: string) {
    return await this.userRequestOfferRepository.delete(id);
  }
}
