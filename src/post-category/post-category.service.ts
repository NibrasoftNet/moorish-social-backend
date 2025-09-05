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
import { PostCategoryEntity } from './entities/post-category.entity';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';

@Injectable()
export class PostCategoryService {
  constructor(
    @InjectRepository(PostCategoryEntity)
    private readonly postCategoryRepository: Repository<PostCategoryEntity>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createCategory(
    createPostCategoryDto: CreatePostCategoryDto,
  ): Promise<PostCategoryEntity> {
    this.logger.info(`category-createCategory`, {
      description: `category-createCategory`,
      class: PostCategoryService.name,
      function: 'createCategory',
    });
    const category = this.postCategoryRepository.create(
      createPostCategoryDto as DeepPartial<PostCategoryEntity>,
    );
    return await this.postCategoryRepository.save(category);
  }

  async findAll(
    fields?: FindOptionsWhere<PostCategoryEntity>,
    relations?: FindOptionsRelations<PostCategoryEntity>,
  ): Promise<PostCategoryEntity[]> {
    this.logger.info(`category-findAll`, {
      description: `category-findAll`,
      class: PostCategoryService.name,
      function: 'findAll',
    });
    return await this.postCategoryRepository.find({
      where: fields,
      relations: relations,
    });
  }

  /**
   * Get a category by ID
   * @returns {Promise<PostCategoryEntity | undefined>} retrieved category or undefined if not found
   * @param fields
   * @param relations
   */
  async findOne(
    fields: FindOptionsWhere<PostCategoryEntity>,
    relations?: FindOptionsRelations<PostCategoryEntity>,
  ): Promise<NullableType<PostCategoryEntity>> {
    this.logger.info(`category-findOne`, {
      description: `category-findOne`,
      class: PostCategoryService.name,
      function: 'findOne',
    });
    return await this.postCategoryRepository.findOne({
      where: fields,
      relations: relations,
    });
  }

  /**
   * Get a category by ID
   * @returns {Promise<PostCategoryEntity>} retrieved category or undefined if not found
   * @param fields
   * @param relations
   */
  async findOneOrFail(
    fields: FindOptionsWhere<PostCategoryEntity>,
    relations?: FindOptionsRelations<PostCategoryEntity>,
  ): Promise<PostCategoryEntity> {
    this.logger.info(`category-findOneOrFail`, {
      description: `category-findOneOrFail`,
      class: PostCategoryService.name,
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
   * @returns {Promise<PostCategoryEntity | undefined>} updated category or undefined if not found
   */
  async update(
    id: string,
    updatePostCategoryDto: UpdatePostCategoryDto,
  ): Promise<PostCategoryEntity> {
    this.logger.info(`category-update`, {
      description: `category-update`,
      class: PostCategoryService.name,
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
      class: PostCategoryService.name,
      function: 'remove',
    });
    return await this.postCategoryRepository.delete(id);
  }
}
