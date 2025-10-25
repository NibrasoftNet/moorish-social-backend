import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CompanyPostEntity } from '../entities/company-post.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { companyPostPaginationConfig } from '../config/company-post-pagination-config';
import { NullableType } from '../../utils/types/nullable.type';

@Injectable()
export class CompanyPostPublicService {
  constructor(
    @InjectRepository(CompanyPostEntity)
    private readonly companyPostRepository: Repository<CompanyPostEntity>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<CompanyPostEntity>> {
    return await paginate<CompanyPostEntity>(
      query,
      this.companyPostRepository,
      companyPostPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<CompanyPostEntity>,
    relations?: FindOptionsRelations<CompanyPostEntity>,
  ): Promise<NullableType<CompanyPostEntity>> {
    return await this.companyPostRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CompanyPostEntity>,
    relations?: FindOptionsRelations<CompanyPostEntity>,
  ): Promise<CompanyPostEntity> {
    return await this.companyPostRepository.findOneOrFail({
      where: field,
      relations,
    });
  }
}
