import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { NullableType } from '../utils/types/nullable.type';
import { TokenCategoryEntity } from './entities/token-category.entity';
import { CreateTokenCategoryDto } from '@/domains/token-category/create-token-category.dto';
import { tokenCategoryPaginationConfig } from './config/token-category-pagination-config';
import { UpdateTokenCategoryDto } from '@/domains/token-category/update-token-category.dto';

@Injectable()
export class TokenCategoryService {
  constructor(
    @InjectRepository(TokenCategoryEntity)
    private readonly tokenCategoryRepository: Repository<TokenCategoryEntity>,
  ) {}
  async create(
    createTokenCategoryDto: CreateTokenCategoryDto,
  ): Promise<TokenCategoryEntity> {
    const tokenCategory = this.tokenCategoryRepository.create(
      createTokenCategoryDto as Partial<TokenCategoryEntity>,
    );
    return await this.tokenCategoryRepository.save(tokenCategory);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<TokenCategoryEntity>> {
    return await paginate(
      query,
      this.tokenCategoryRepository,
      tokenCategoryPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<TokenCategoryEntity>,
    relations?: FindOptionsRelations<TokenCategoryEntity>,
  ): Promise<NullableType<TokenCategoryEntity>> {
    return await this.tokenCategoryRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<TokenCategoryEntity>,
    relations?: FindOptionsRelations<TokenCategoryEntity>,
  ): Promise<TokenCategoryEntity> {
    return await this.tokenCategoryRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTokenCategoryDto: UpdateTokenCategoryDto,
  ): Promise<TokenCategoryEntity> {
    const tokenCategory = await this.findOneOrFail({ id });
    Object.assign(tokenCategory, updateTokenCategoryDto);
    return await this.tokenCategoryRepository.save(tokenCategory);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tokenCategoryRepository.delete(id);
  }
}
