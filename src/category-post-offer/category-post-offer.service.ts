import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { CategoryPostOfferEntity } from './entities/category-post-offer.entity';
import { CreateCategoryPostOfferDto } from './dto/create-category-post-offer.dto';
import { UpdateCategoryPostOfferDto } from './dto/update-category-post-offer.dto';

@Injectable()
export class CategoryPostOfferService {
  constructor(
    @InjectRepository(CategoryPostOfferEntity)
    private readonly postCategoryRepository: Repository<CategoryPostOfferEntity>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createCategory(
    createPostCategoryDto: CreateCategoryPostOfferDto,
  ): Promise<CategoryPostOfferEntity> {
    this.logger.info(`category-createCategory`, {
      description: `category-createCategory`,
      class: CategoryPostOfferService.name,
      function: 'createCategory',
    });
    const category = this.postCategoryRepository.create(
      createPostCategoryDto as DeepPartial<CategoryPostOfferEntity>,
    );
    return await this.postCategoryRepository.save(category);
  }

  async findAll(
    fields?: FindOptionsWhere<CategoryPostOfferEntity>,
    relations?: FindOptionsRelations<CategoryPostOfferEntity>,
  ): Promise<CategoryPostOfferEntity[]> {
    this.logger.info(`category-findAll`, {
      description: `category-findAll`,
      class: CategoryPostOfferService.name,
      function: 'findAll',
    });
    return await this.postCategoryRepository.find({
      where: fields,
      relations: relations,
    });
  }

  /**
   * Get a category by ID
   * @returns {Promise<CategoryPostOfferEntity | undefined>} retrieved category or undefined if not found
   * @param fields
   * @param relations
   */
  async findOne(
    fields: FindOptionsWhere<CategoryPostOfferEntity>,
    relations?: FindOptionsRelations<CategoryPostOfferEntity>,
  ): Promise<NullableType<CategoryPostOfferEntity>> {
    this.logger.info(`category-findOne`, {
      description: `category-findOne`,
      class: CategoryPostOfferService.name,
      function: 'findOne',
    });
    return await this.postCategoryRepository.findOne({
      where: fields,
      relations: relations,
    });
  }

  /**
   * Get a category by ID
   * @returns {Promise<CategoryPostOfferEntity>} retrieved category or undefined if not found
   * @param fields
   * @param relations
   */
  async findOneOrFail(
    fields: FindOptionsWhere<CategoryPostOfferEntity>,
    relations?: FindOptionsRelations<CategoryPostOfferEntity>,
  ): Promise<CategoryPostOfferEntity> {
    this.logger.info(`category-findOneOrFail`, {
      description: `category-findOneOrFail`,
      class: CategoryPostOfferService.name,
      function: 'findOneOrFail',
    });
    return await this.postCategoryRepository.findOneOrFail({
      where: fields,
      relations: relations,
    });
  }

  /**
   * Update a category
   * @param id {number} category ID
   * @param updatePostCategoryDto
   * @returns {Promise<CategoryPostOfferEntity | undefined>} updated category or undefined if not found
   */
  async update(
    id: string,
    updatePostCategoryDto: UpdateCategoryPostOfferDto,
  ): Promise<CategoryPostOfferEntity> {
    this.logger.info(`category-update`, {
      description: `category-update`,
      class: CategoryPostOfferService.name,
      function: 'update',
    });
    const existingCategory = await this.findOneOrFail({ id: id });
    Object.assign(existingCategory, updatePostCategoryDto);
    return await this.postCategoryRepository.save(existingCategory);
  }

  /**
   * Delete a category by ID
   * @param id {number} category ID
   * @returns {Promise<DeleteResult>} deletion result
   */
  async remove(id: string): Promise<DeleteResult> {
    this.logger.info(`category-remove`, {
      description: `category-remove`,
      class: CategoryPostOfferService.name,
      function: 'remove',
    });
    return await this.postCategoryRepository.delete(id);
  }
}
