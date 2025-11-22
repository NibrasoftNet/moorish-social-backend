import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { CategoryTenderEntity } from './entities/category-tender.entity';
import { CreateCategoryTenderDto } from './dto/create-category-tender.dto';
import { UpdateCategoryTenderDto } from './dto/update-category-tender.dto';

@Injectable()
export class CategoryTenderService {
  constructor(
    @InjectRepository(CategoryTenderEntity)
    private readonly tenderCategoryRepository: Repository<CategoryTenderEntity>,
  ) {}
  async create(
    createTenderCategoryDto: CreateCategoryTenderDto,
  ): Promise<CategoryTenderEntity> {
    const tenderCategory = this.tenderCategoryRepository.create(
      createTenderCategoryDto as Partial<CategoryTenderEntity>,
    );
    return await this.tenderCategoryRepository.save(tenderCategory);
  }

  async findAll(): Promise<CategoryTenderEntity[]> {
    return await this.tenderCategoryRepository.find();
  }

  async findOne(
    field: FindOptionsWhere<CategoryTenderEntity>,
    relations?: FindOptionsRelations<CategoryTenderEntity>,
  ): Promise<NullableType<CategoryTenderEntity>> {
    return await this.tenderCategoryRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CategoryTenderEntity>,
    relations?: FindOptionsRelations<CategoryTenderEntity>,
  ): Promise<CategoryTenderEntity> {
    return await this.tenderCategoryRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTokenCategoryDto: UpdateCategoryTenderDto,
  ): Promise<CategoryTenderEntity> {
    const tenderCategory = await this.findOneOrFail({ id });
    Object.assign(tenderCategory, updateTokenCategoryDto);
    return await this.tenderCategoryRepository.save(tenderCategory);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tenderCategoryRepository.delete(id);
  }
}
