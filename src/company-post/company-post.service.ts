import { Injectable } from '@nestjs/common';
import { CreateCompanyPostDto } from '@/domains/company-post/create-company-post.dto';
import { UpdateCompanyPostDto } from '@/domains/company-post/update-company-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CompanyPostEntity } from './entities/company-post.entity';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { CompanyService } from '../company/company.service';
import { UsersTenantService } from '../users-tenant/users-tenant.service';
import { FilesService } from '../files/files.service';
import { PostCategoryService } from '../post-category/post-category.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { companyPostPaginationConfig } from './config/company-post-pagination-config';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class CompanyPostService {
  constructor(
    @InjectRepository(CompanyPostEntity)
    private readonly companyPostRepository: Repository<CompanyPostEntity>,
    private readonly companyService: CompanyService,
    private readonly userTenantService: UsersTenantService,
    private readonly filesService: FilesService,
    private readonly postCategoryService: PostCategoryService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    companyId: string,
    categoryId: string,
    createCompanyPostDto: CreateCompanyPostDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyPostEntity> {
    const post = this.companyPostRepository.create(
      createCompanyPostDto as DeepPartial<CompanyPostEntity>,
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
    return await this.companyPostRepository.save(post);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<CompanyPostEntity>> {
    return await paginate<CompanyPostEntity>(
      query,
      this.companyPostRepository,
      companyPostPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<CompanyPostEntity>,
    relations?: FindOptionsRelations<CompanyPostEntity>,
  ): Promise<NullableType<CompanyPostEntity>> {
    return await this.companyPostRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CompanyPostEntity>,
    relations?: FindOptionsRelations<CompanyPostEntity>,
  ): Promise<CompanyPostEntity> {
    return await this.companyPostRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateCompanyPostDto: UpdateCompanyPostDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyPostEntity> {
    const post = await this.findOneOrFail({ id });
    Object.assign(post, updateCompanyPostDto);
    if (files) {
      post.images = await this.filesService.uploadMultipleFiles(files);
    }
    return await this.companyPostRepository.save(post);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.companyPostRepository.delete(id);
  }
}
