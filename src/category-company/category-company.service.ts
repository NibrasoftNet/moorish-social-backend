import { Injectable } from '@nestjs/common';
import { CreateCategoryCompanyDto } from './dto/create-category-company.dto';
import { UpdateCategoryCompanyDto } from './dto/update-category-company.dto';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { categoryCompanyPaginationConfig } from './config/category-company-pagination-config';
import { FilesService } from '../files/files.service';
import { NullableType } from '../utils/types/nullable.type';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { CategoryCompanyEntity } from './entities/category-company.entity';

@Injectable()
export class CategoryCompanyService {
  constructor(
    @InjectRepository(CategoryCompanyEntity)
    private readonly companyCategoryRepository: Repository<CategoryCompanyEntity>,
    private readonly fileService: FilesService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryCompanyDto,
    parentId?: string,
  ): Promise<CategoryCompanyEntity> {
    this.logger.info(`category-createCategory`, {
      description: `category-createCategory`,
      class: CategoryCompanyService.name,
      function: 'createCategory',
    });
    const category = this.companyCategoryRepository.create(
      createCategoryDto as DeepPartial<CategoryCompanyEntity>,
    );
    if (parentId) {
      category.parent = await this.findOneOrFail({
        id: parentId,
      });
    }
    return await this.companyCategoryRepository.save(category);
  }

  async findAllPaginated(
    query: PaginateQuery,
  ): Promise<Paginated<CategoryCompanyEntity>> {
    this.logger.info(`category-findAllPaginated`, {
      description: `category-findAllPaginated`,
      class: CategoryCompanyService.name,
      function: 'findAllPaginated',
    });
    return await paginate(
      query,
      this.companyCategoryRepository,
      categoryCompanyPaginationConfig,
    );
  }

  /**
   * Get all parent categories
   * @returns {Promise<CategoryCompanyEntity[]>} list of all parent categories
   */
  async findAllParents(
    query: PaginateQuery,
  ): Promise<Paginated<CategoryCompanyEntity>> {
    this.logger.info(`category-findAllParents`, {
      description: `category-findAllParents`,
      class: CategoryCompanyService.name,
      function: 'findAllParents',
    });
    const queryBuilder = this.companyCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .where('category.parent IS NULL');
    return await paginate(query, queryBuilder, categoryCompanyPaginationConfig);
  }

  async findAllChildren(): Promise<CategoryCompanyEntity[]> {
    this.logger.info(`category-findAll`, {
      description: `category-findAll`,
      class: CategoryCompanyService.name,
      function: 'findAll',
    });
    return await this.companyCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.children', 'children')
      .where('category.parent IS NOT NULL')
      .getMany();
  }

  /**
   * Get a category by ID
   * @returns {Promise<CategoryCompanyEntity | undefined>} retrieved category or undefined if not found
   * @param fields
   * @param relations
   */
  async findOne(
    fields: FindOptionsWhere<CategoryCompanyEntity>,
    relations?: FindOptionsRelations<CategoryCompanyEntity>,
  ): Promise<NullableType<CategoryCompanyEntity>> {
    this.logger.info(`category-findOne`, {
      description: `category-findOne`,
      class: CategoryCompanyService.name,
      function: 'findOne',
    });
    return await this.companyCategoryRepository.findOne({
      where: fields,
      relations: relations,
    });
  }

  /**
   * Get a category by ID
   * @returns {Promise<CategoryCompanyEntity>} retrieved category or undefined if not found
   * @param fields
   * @param relations
   */
  async findOneOrFail(
    fields: FindOptionsWhere<CategoryCompanyEntity>,
    relations?: FindOptionsRelations<CategoryCompanyEntity>,
  ): Promise<CategoryCompanyEntity> {
    this.logger.info(`category-findOneOrFail`, {
      description: `category-findOneOrFail`,
      class: CategoryCompanyService.name,
      function: 'findOneOrFail',
    });
    return await this.companyCategoryRepository.findOneOrFail({
      where: fields,
      relations: relations,
    });
  }

  async findByIdsOrFail(ids: string[]): Promise<CategoryCompanyEntity[]> {
    return await this.companyCategoryRepository.findBy({ id: In(ids) });
  }

  /**
   * Update a category
   * @param id {number} category ID
   * @param updateCategoryDto {UpdateCategoryCompanyDto} data to update a category
   * @returns {Promise<CategoryCompanyEntity | undefined>} updated category or undefined if not found
   */
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryCompanyDto,
  ): Promise<CategoryCompanyEntity> {
    this.logger.info(`category-update`, {
      description: `category-update`,
      class: CategoryCompanyService.name,
      function: 'update',
    });
    const existingCategory = await this.findOneOrFail({ id });
    Object.assign(existingCategory, updateCategoryDto);
    return await this.companyCategoryRepository.save(existingCategory);
  }

  /**
   * Delete a category by ID
   * @param id {number} category ID
   * @returns {Promise<DeleteResult>} deletion result
   */
  async remove(id: string): Promise<DeleteResult> {
    this.logger.info(`category-remove`, {
      description: `category-remove`,
      class: CategoryCompanyService.name,
      function: 'remove',
    });
    return await this.companyCategoryRepository.delete(id);
  }
}
