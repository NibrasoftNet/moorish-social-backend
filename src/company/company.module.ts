import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanySerializationProfile } from './serialization/company-serialization.profile';
import { CompanyEntity } from './entities/company.entity';
import { FilesModule } from '../files/files.module';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { TenantAwareRepositoryModule } from '../utils/repository/tenant-aware/tenant-aware.module';
import { AddressModule } from '../address/address.module';
import { CompanyCategoryModule } from '../company-category/company-category.module';

@Module({
  imports: [
    TenantAwareRepositoryModule.forEntities([CompanyEntity]),
    FilesModule,
    AddressModule,
    UsersTenantModule,
    CompanyCategoryModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanySerializationProfile],
  exports: [CompanyService],
})
export class CompanyModule {}
