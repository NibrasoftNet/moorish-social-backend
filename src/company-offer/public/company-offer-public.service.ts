import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CompanyOfferEntity } from '../entities/company-offer.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { companyOfferPaginationConfig } from '../config/company-offer-pagination-config';
import { NullableType } from '../../utils/types/nullable.type';

@Injectable()
export class CompanyOfferPublicService {
  constructor(
    @InjectRepository(CompanyOfferEntity)
    private readonly companyOfferRepository: Repository<CompanyOfferEntity>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<CompanyOfferEntity>> {
    return await paginate<CompanyOfferEntity>(
      query,
      this.companyOfferRepository,
      companyOfferPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<CompanyOfferEntity>,
    relations?: FindOptionsRelations<CompanyOfferEntity>,
  ): Promise<NullableType<CompanyOfferEntity>> {
    return await this.companyOfferRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CompanyOfferEntity>,
    relations?: FindOptionsRelations<CompanyOfferEntity>,
  ): Promise<CompanyOfferEntity> {
    return await this.companyOfferRepository.findOneOrFail({
      where: field,
      relations,
    });
  }
}
