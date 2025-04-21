import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CompanyOfferEntity } from './entities/company-offer.entity';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { CompanyService } from '../company/company.service';
import { UsersTenantService } from '../users-tenant/users-tenant.service';
import { FilesService } from '../files/files.service';
import { PostCategoryService } from '../post-category/post-category.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { companyOfferPaginationConfig } from './config/company-offer-pagination-config';
import { NullableType } from 'src/utils/types/nullable.type';
import { CreateCompanyOfferDto } from '@/domains/company-offer/create-company-offer.dto';
import { UpdateCompanyOfferDto } from '@/domains/company-offer/update-company-offer.dto';

@Injectable()
export class CompanyOfferService {
  constructor(
    @InjectRepository(CompanyOfferEntity)
    private readonly companyOfferRepository: Repository<CompanyOfferEntity>,
    private readonly companyService: CompanyService,
    private readonly userTenantService: UsersTenantService,
    private readonly filesService: FilesService,
    private readonly postCategoryService: PostCategoryService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    companyId: string,
    categoryId: string,
    createCompanyOfferDto: CreateCompanyOfferDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyOfferEntity> {
    const post = this.companyOfferRepository.create(
      createCompanyOfferDto as DeepPartial<CompanyOfferEntity>,
    );
    post.creator = await this.userTenantService.findOneOrFail({
      id: userJwtPayload.id,
    });
    post.company = await this.companyService.findOneOrFail({ id: companyId });
    post.category = await this.postCategoryService.findOneOrFail({
      id: categoryId,
    });
    if (files) {
      post.images = await this.filesService.uploadMultipleFiles(files);
    }
    return await this.companyOfferRepository.save(post);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<CompanyOfferEntity>> {
    return await paginate<CompanyOfferEntity>(
      query,
      this.companyOfferRepository,
      companyOfferPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<CompanyOfferEntity>,
    relations?: FindOptionsRelations<CompanyOfferEntity>,
  ): Promise<NullableType<CompanyOfferEntity>> {
    return await this.companyOfferRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CompanyOfferEntity>,
    relations?: FindOptionsRelations<CompanyOfferEntity>,
  ): Promise<CompanyOfferEntity> {
    return await this.companyOfferRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateCompanyOfferDto: UpdateCompanyOfferDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyOfferEntity> {
    const post = await this.findOneOrFail({ id });
    Object.assign(post, updateCompanyOfferDto);
    if (files) {
      post.images = await this.filesService.uploadMultipleFiles(files);
    }
    return await this.companyOfferRepository.save(post);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.companyOfferRepository.delete(id);
  }
}
