import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeepPartial, DeleteResult } from 'typeorm';
import { FilesService } from '../../files/files.service';
import { AddressService } from '../../address/address.service';
import { WinstonLoggerService } from '../../logger/winston-logger.service';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';
import { InjectTenantAwareRepository } from '../../utils/repository/tenant-aware';
import { CompanyEntity } from '../entities/company.entity';
import { TenantAwareRepository } from '../../utils/repository/tenant-aware';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UsersTenantService } from '../../users-tenant/users-tenant.service';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CategoryCompanyService } from '../../category-company/category-company.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CompanyPublicService } from '../public/company-public.service';

@Injectable()
export class CompanyPrivateService {
  constructor(
    @InjectTenantAwareRepository(CompanyEntity)
    private readonly companyRepository: TenantAwareRepository<CompanyEntity>,
    private readonly usersTenantService: UsersTenantService,
    private readonly companyCategoryService: CategoryCompanyService,
    private readonly privateCompanyService: CompanyPublicService,
    private readonly fileService: FilesService,
    private readonly addressService: AddressService,
    private readonly logger: WinstonLoggerService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    createCompanyDto: CreateCompanyDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyEntity> {
    this.logger.info(`create-new-company`, {
      description: `Create a new Company`,
      class: CompanyPrivateService.name,
      function: 'create',
    });
    const { categories, ...filteredCreateCompanyDto } = createCompanyDto;
    const company = this.companyRepository.createTenantContext(
      filteredCreateCompanyDto as DeepPartial<CompanyEntity>,
    );
    const tenant = await this.usersTenantService.findOneOrFail({
      id: userJwtPayload.id,
    });
    if (tenant.company) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            user: this.i18n.t('company.alreadyCreated', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    company.categories =
      await this.companyCategoryService.findByIdsOrFail(categories);
    company.address = await this.addressService.create(
      createCompanyDto.address,
    );
    if (!!file) {
      company.image = await this.fileService.uploadFile(file);
    }
    const savedCompany = await this.companyRepository.save(company);
    await this.usersTenantService.addCompanyToTenant(tenant, savedCompany);
    // Save the team using the transaction manager
    return savedCompany;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyEntity> {
    const { address, ...filteredUpdateCompanyDto } = updateCompanyDto;
    const company = await this.privateCompanyService.findOneOrFail({ id });
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
