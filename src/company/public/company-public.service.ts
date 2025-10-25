import { Injectable } from '@nestjs/common';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { NullableType } from '../../utils/types/nullable.type';
import { CompanyEntity } from '../entities/company.entity';
import { companyPaginationConfig } from '../config/company-pagination-config';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyPublicService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<CompanyEntity>> {
    return await paginate(
      query,
      this.companyRepository,
      companyPaginationConfig,
    );
  }
  async findOne(
    fields: FindOptionsWhere<CompanyEntity>,
    relations?: FindOptionsRelations<CompanyEntity>,
    select?: FindOptionsSelect<CompanyEntity>,
  ): Promise<NullableType<CompanyEntity>> {
    return await this.companyRepository.findOne({
      where: fields,
      relations,
      select,
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<CompanyEntity>,
    relations?: FindOptionsRelations<CompanyEntity>,
    select?: FindOptionsSelect<CompanyEntity>,
  ): Promise<CompanyEntity> {
    return await this.companyRepository.findOneOrFail({
      where: fields,
      relations,
      select,
    });
  }
}
