import { Injectable } from '@nestjs/common';
import { CreateUserTenderDto } from './dto/create-user-tender.dto';
import { UpdateUserTenderDto } from './dto/update-user-tender.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FilesService } from '../files/files.service';
import { UsersService } from '../users/users.service';
import { UserTenderEntity } from './entities/user-tender.entity';
import { CategoryTenderService } from '../category-tender/category-tender.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { userTenderPaginationConfig } from './config/user-tender-pagination.config';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class UserTenderService {
  constructor(
    @InjectRepository(UserTenderEntity)
    private readonly tenderRepository: Repository<UserTenderEntity>,
    private readonly userService: UsersService,
    private readonly filesService: FilesService,
    private readonly tenderCategoryService: CategoryTenderService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    categoryId: string,
    createTenderDto: CreateUserTenderDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<UserTenderEntity> {
    const tender = this.tenderRepository.create(
      createTenderDto as DeepPartial<UserTenderEntity>,
    );
    tender.creator = await this.userService.findOneOrFail({
      id: userJwtPayload.id,
    });
    tender.category = await this.tenderCategoryService.findOneOrFail({
      id: categoryId,
    });
    if (files) {
      tender.documents = await this.filesService.uploadMultipleFiles(files);
    }
    return await this.tenderRepository.save(tender);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<UserTenderEntity>> {
    return await paginate<UserTenderEntity>(
      query,
      this.tenderRepository,
      userTenderPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ): Promise<Paginated<UserTenderEntity>> {
    const queryBuilder = this.tenderRepository
      .createQueryBuilder('tender')
      .leftJoinAndSelect('tender.creator', 'creator')
      .leftJoinAndSelect('tender.category', 'category')
      .where('creator.id = :id', { id: userJwtPayload.id });
    return await paginate<UserTenderEntity>(
      query,
      queryBuilder,
      userTenderPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<UserTenderEntity>,
    relations?: FindOptionsRelations<UserTenderEntity>,
  ): Promise<NullableType<UserTenderEntity>> {
    return await this.tenderRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<UserTenderEntity>,
    relations?: FindOptionsRelations<UserTenderEntity>,
  ): Promise<UserTenderEntity> {
    return await this.tenderRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateUserTenderDto: UpdateUserTenderDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<UserTenderEntity> {
    const tender = await this.findOneOrFail({ id });
    const { deleteImages, ...filteredUserTenderDto } = updateUserTenderDto;
    Object.assign(tender, filteredUserTenderDto);
    if (deleteImages) {
      await this.filesService.deleteMultipleFiles(deleteImages);
    }
    if (files) {
      tender.documents = await this.filesService.uploadMultipleFiles(files);
    }
    return await this.tenderRepository.save(tender);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tenderRepository.delete(id);
  }
}
