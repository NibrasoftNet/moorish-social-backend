import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { TenderCategoryEntity } from './entities/tender-category.entity';
import { CreateTenderCategoryDto } from '@/domains/tender-category/create-tender-category.dto';
import { UpdateTenderCategoryDto } from '@/domains/tender-category/update-tender-category.dto';

@Injectable()
export class TenderCategoryService {
  constructor(
    @InjectRepository(TenderCategoryEntity)
    private readonly tenderCategoryRepository: Repository<TenderCategoryEntity>,
  ) {}
  async create(
    createTenderCategoryDto: CreateTenderCategoryDto,
  ): Promise<TenderCategoryEntity> {
    const tenderCategory = this.tenderCategoryRepository.create(
      createTenderCategoryDto as Partial<TenderCategoryEntity>,
    );
    return await this.tenderCategoryRepository.save(tenderCategory);
  }

  async findAll(): Promise<TenderCategoryEntity[]> {
    return await this.tenderCategoryRepository.find();
  }

  async findOne(
    field: FindOptionsWhere<TenderCategoryEntity>,
    relations?: FindOptionsRelations<TenderCategoryEntity>,
  ): Promise<NullableType<TenderCategoryEntity>> {
    return await this.tenderCategoryRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<TenderCategoryEntity>,
    relations?: FindOptionsRelations<TenderCategoryEntity>,
  ): Promise<TenderCategoryEntity> {
    return await this.tenderCategoryRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTokenCategoryDto: UpdateTenderCategoryDto,
  ): Promise<TenderCategoryEntity> {
    const tenderCategory = await this.findOneOrFail({ id });
    Object.assign(tenderCategory, updateTokenCategoryDto);
    return await this.tenderCategoryRepository.save(tenderCategory);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tenderCategoryRepository.delete(id);
  }
}
