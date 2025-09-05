import { Injectable } from '@nestjs/common';
import { CreateCompanyCategoryDto } from './dto/create-company-category.dto';
import { UpdateCompanyCategoryDto } from './dto/update-company-category.dto';
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
import { companyCategoryPaginationConfig } from './config/company-category-pagination-config';
import { FilesService } from '../files/files.service';
import { NullableType } from '../utils/types/nullable.type';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { CompanyCategoryEntity } from './entities/company-category.entity';

@Injectable()
export class CompanyCategoryService {
  constructor(
    @InjectRepository(CompanyCategoryEntity)
    private readonly companyCategoryRepository: Repository<CompanyCategoryEntity>,
    private readonly fileService: FilesService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCompanyCategoryDto,
    parentId?: string,
  ): Promise<CompanyCategoryEntity> {
    this.logger.info(`category-createCategory`, {
      description: `category-createCategory`,
      class: CompanyCategoryService.name,
      function: 'createCategory',
    });
    const category = this.companyCategoryRepository.create(
      createCategoryDto as DeepPartial<CompanyCategoryEntity>,
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
  ): Promise<Paginated<CompanyCategoryEntity>> {
    this.logger.info(`category-findAllPaginated`, {
      description: `category-findAllPaginated`,
      class: CompanyCategoryService.name,
      function: 'findAllPaginated',
    });
    return await paginate(
      query,
      this.companyCategoryRepository,
      companyCategoryPaginationConfig,
    );
  }

  /**
   * Get all parent categories
   * @returns {Promise<CompanyCategoryEntity[]>} list of all parent categories
   */
  async findAllParents(
    query: PaginateQuery,
  ): Promise<Paginated<CompanyCategoryEntity>> {
    this.logger.info(`category-findAllParents`, {
      description: `category-findAllParents`,
      class: CompanyCategoryService.name,
      function: 'findAllParents',
    });
    const queryBuilder = this.companyCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .where('category.parent IS NULL');
    return await paginate(query, queryBuilder, companyCategoryPaginationConfig);
  }

  async findAllChildren(): Promise<CompanyCategoryEntity[]> {
    this.logger.info(`category-findAll`, {
      description: `category-findAll`,
      class: CompanyCategoryService.name,
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
   * @returns {Promise<CompanyCategoryEntity | undefined>} retrieved category or undefined if not found
   * @param fields
   * @param relations
   */
  async findOne(
    fields: FindOptionsWhere<CompanyCategoryEntity>,
    relations?: FindOptionsRelations<CompanyCategoryEntity>,
  ): Promise<NullableType<CompanyCategoryEntity>> {
    this.logger.info(`category-findOne`, {
      description: `category-findOne`,
      class: CompanyCategoryService.name,
      function: 'findOne',
    });
    return await this.companyCategoryRepository.findOne({
      where: fields,
      relations: relations,
    });
  }

  /**
   * Get a category by ID
   * @returns {Promise<CompanyCategoryEntity>} retrieved category or undefined if not found
   * @param fields
   * @param relations
   */
  async findOneOrFail(
    fields: FindOptionsWhere<CompanyCategoryEntity>,
    relations?: FindOptionsRelations<CompanyCategoryEntity>,
  ): Promise<CompanyCategoryEntity> {
    this.logger.info(`category-findOneOrFail`, {
      description: `category-findOneOrFail`,
      class: CompanyCategoryService.name,
      function: 'findOneOrFail',
    });
    return await this.companyCategoryRepository.findOneOrFail({
      where: fields,
      relations: relations,
    });
  }

  async findByIdsOrFail(ids: string[]): Promise<CompanyCategoryEntity[]> {
    return await this.companyCategoryRepository.findBy({ id: In(ids) });
  }

  /**
   * Update a category
   * @param id {number} category ID
   * @param updateCategoryDto {UpdateCompanyCategoryDto} data to update a category
   * @returns {Promise<CompanyCategoryEntity | undefined>} updated category or undefined if not found
   */
  async update(
    id: string,
    updateCategoryDto: UpdateCompanyCategoryDto,
  ): Promise<CompanyCategoryEntity> {
    this.logger.info(`category-update`, {
      description: `category-update`,
      class: CompanyCategoryService.name,
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
      class: CompanyCategoryService.name,
      function: 'remove',
    });
    return await this.companyCategoryRepository.delete(id);
  }
}
