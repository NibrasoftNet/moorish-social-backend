import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { FilesService } from '../files/files.service';
import { AddressService } from '../address/address.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { NullableType } from '../utils/types/nullable.type';
import { InjectTenantAwareRepository } from '../utils/repository/tenant-aware/inject-tenant-aware-repository.decorator';
import { CompanyEntity } from './entities/company.entity';
import { TenantAwareRepository } from '../utils/repository/tenant-aware/tenant-aware.repository';
import { CreateCompanyDto } from '@/domains/company/create-company.dto';
import { UsersTenantService } from '../users-tenant/users-tenant.service';
import { companyPaginationConfig } from './config/company-pagination-config';
import { UpdateCompanyDto } from '@/domains/company/update-company.dto';
import { CompanyCategoryService } from '../company-category/company-category.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectTenantAwareRepository(CompanyEntity)
    private readonly companyRepository: TenantAwareRepository<CompanyEntity>,
    private readonly usersTenantService: UsersTenantService,
    private readonly companyCategoryService: CompanyCategoryService,
    private readonly fileService: FilesService,
    private readonly addressService: AddressService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    categoryId: string,
    createCompanyDto: CreateCompanyDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyEntity> {
    this.logger.info(`create-new-company`, {
      description: `Create a new Company`,
      class: CompanyService.name,
      function: 'create',
    });
    const company = this.companyRepository.createTenantContext(
      createCompanyDto as DeepPartial<CompanyEntity>,
    );
    company.category = await this.companyCategoryService.findOneOrFail({
      id: categoryId,
    });
    company.address = await this.addressService.create(
      createCompanyDto.address,
    );
    if (!!file) {
      company.image = await this.fileService.uploadFile(file);
    }
    const savedCompany = await this.companyRepository.save(company);
    await this.usersTenantService.addCompanyToTenant(
      userJwtPayload,
      savedCompany,
    );
    // Save the team using the transaction manager
    return savedCompany;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<CompanyEntity>> {
    return await this.companyRepository.paginateTenantContext(
      query,
      this.companyRepository,
      companyPaginationConfig,
    );
  }

  async findOne(
    fields: FindOptionsWhere<CompanyEntity>,
    relations?: FindOptionsRelations<CompanyEntity>,
    select?: FindOptionsSelect<CompanyEntity>,
  ): Promise<NullableType<CompanyEntity>> {
    return await this.companyRepository.findOneTenantContext(
      fields,
      relations,
      select,
    );
  }

  async findOneOrFail(
    fields: FindOptionsWhere<CompanyEntity>,
    relations?: FindOptionsRelations<CompanyEntity>,
    select?: FindOptionsSelect<CompanyEntity>,
  ): Promise<CompanyEntity> {
    return await this.companyRepository.findOneOrFailTenantContext(
      fields,
      relations,
      select,
    );
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyEntity> {
    const { address, ...filteredUpdateCompanyDto } = updateCompanyDto;
    const company = await this.findOneOrFail({ id });
    Object.assign(company, filteredUpdateCompanyDto);
    if (address) {
      company.address = await this.addressService.update(
        company.address.id,
        address,
      );
    }
    if (file) {
      company.image = company.image?.id
        ? await this.fileService.updateFile(company.image.id, file)
        : await this.fileService.uploadFile(file);
    }
    return await this.companyRepository.saveTenantContext(company);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.companyRepository.softDeleteTenantContext({ id });
  }
}
