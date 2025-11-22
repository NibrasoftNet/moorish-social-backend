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
import { CategoryTokenEntity } from './entities/category-token.entity';
import { CreateCategoryTokenDto } from './dto/create-category-token.dto';
import { categoryTokenPaginationConfig } from './config/category-token-pagination-config';
import { UpdateCategoryTokenDto } from './dto/update-category-token.dto';

@Injectable()
export class CategoryTokenService {
  constructor(
    @InjectRepository(CategoryTokenEntity)
    private readonly tokenCategoryRepository: Repository<CategoryTokenEntity>,
  ) {}
  async create(
    createTokenCategoryDto: CreateCategoryTokenDto,
  ): Promise<CategoryTokenEntity> {
    const tokenCategory = this.tokenCategoryRepository.create(
      createTokenCategoryDto as Partial<CategoryTokenEntity>,
    );
    return await this.tokenCategoryRepository.save(tokenCategory);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<CategoryTokenEntity>> {
    return await paginate(
      query,
      this.tokenCategoryRepository,
      categoryTokenPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<CategoryTokenEntity>,
    relations?: FindOptionsRelations<CategoryTokenEntity>,
  ): Promise<NullableType<CategoryTokenEntity>> {
    return await this.tokenCategoryRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CategoryTokenEntity>,
    relations?: FindOptionsRelations<CategoryTokenEntity>,
  ): Promise<CategoryTokenEntity> {
    return await this.tokenCategoryRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTokenCategoryDto: UpdateCategoryTokenDto,
  ): Promise<CategoryTokenEntity> {
    const tokenCategory = await this.findOneOrFail({ id });
    Object.assign(tokenCategory, updateTokenCategoryDto);
    return await this.tokenCategoryRepository.save(tokenCategory);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tokenCategoryRepository.delete(id);
  }
}
