import { Module } from '@nestjs/common';
import { CompanyPrivateService } from './private/company-private.service';
import { CompanyPublicService } from './public/company-public.service';
import { CompanyPublicController } from './public/company-public.controller';
import { CompanyPrivateController } from './private/company-private.controller';
import { CompanySerializationProfile } from './serialization/company-serialization.profile';
import { CompanyEntity } from './entities/company.entity';
import { FilesModule } from '../files/files.module';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { TenantAwareRepositoryModule } from '../utils/repository/tenant-aware';
import { AddressModule } from '../address/address.module';
import { CategoryCompanyModule } from '../category-company/category-company.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TenantAwareRepositoryModule.forEntities([CompanyEntity]),
    TypeOrmModule.forFeature([CompanyEntity]),
    FilesModule,
    AddressModule,
    UsersTenantModule,
    CategoryCompanyModule,
  ],
  controllers: [CompanyPublicController, CompanyPrivateController],
  providers: [
    CompanyPrivateService,
    CompanyPublicService,
    CompanySerializationProfile,
  ],
  exports: [CompanyPrivateService, CompanyPublicService],
})
export class CompanyModule {}
