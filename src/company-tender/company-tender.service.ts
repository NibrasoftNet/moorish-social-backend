import { Injectable } from '@nestjs/common';
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
import { TenderCategoryService } from '../tender-category/tender-category.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { NullableType } from '../utils/types/nullable.type';
import { CreateCompanyTenderDto } from './dto/create-company-tender.dto';
import { UsersTenantService } from '../users-tenant/users-tenant.service';
import { CompanyTenderEntity } from './entities/company-tender.entity';
import { companyTenderPaginationConfig } from './config/company-tender-pagination.config';
import { UpdateCompanyTenderDto } from './dto/update-company-tender.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class CompanyTenderService {
  constructor(
    @InjectRepository(CompanyTenderEntity)
    private readonly tenderRepository: Repository<CompanyTenderEntity>,
    private readonly companyService: CompanyService,
    private readonly userTenantService: UsersTenantService,
    private readonly filesService: FilesService,
    private readonly tenderCategoryService: TenderCategoryService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    companyId: string,
    categoryId: string,
    createTenderDto: CreateCompanyTenderDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyTenderEntity> {
    const tender = this.tenderRepository.create(
      createTenderDto as DeepPartial<CompanyTenderEntity>,
    );
    tender.creator = await this.userTenantService.findOneOrFail({
      id: userJwtPayload.id,
    });
    tender.company = await this.companyService.findOneOrFail({
      id: companyId,
    });
    tender.category = await this.tenderCategoryService.findOneOrFail({
      id: categoryId,
    });
    if (files) {
      tender.documents = await this.filesService.uploadMultipleFiles(files);
    }
    return await this.tenderRepository.save(tender);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<CompanyTenderEntity>> {
    return await paginate<CompanyTenderEntity>(
      query,
      this.tenderRepository,
      companyTenderPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ): Promise<Paginated<CompanyTenderEntity>> {
    const queryBuilder = this.tenderRepository
      .createQueryBuilder('tender')
      .leftJoinAndSelect('tender.creator', 'creator')
      .leftJoinAndSelect('tender.category', 'category')
      .where('creator.id = :id', { id: userJwtPayload.id });
    return await paginate<CompanyTenderEntity>(
      query,
      queryBuilder,
      companyTenderPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<CompanyTenderEntity>,
    relations?: FindOptionsRelations<CompanyTenderEntity>,
  ): Promise<NullableType<CompanyTenderEntity>> {
    return await this.tenderRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CompanyTenderEntity>,
    relations?: FindOptionsRelations<CompanyTenderEntity>,
  ): Promise<CompanyTenderEntity> {
    return await this.tenderRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateCompanyTenderDto: UpdateCompanyTenderDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyTenderEntity> {
    const tender = await this.findOneOrFail({ id });
    const { deleteImages, ...filteredCompanyTenderDto } =
      updateCompanyTenderDto;
    Object.assign(tender, filteredCompanyTenderDto);
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
