import { Module } from '@nestjs/common';
import { CompanyTenderService } from './company-tender.service';
import { CompanyTenderController } from './company-tender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTenderModule } from '../category-tender/category-tender.module';
import { FilesModule } from '../files/files.module';
import { CompanyTenderEntity } from './entities/company-tender.entity';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { CompanyTenderSerializationProfile } from './serialization/company-tender-serialization.profile';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyTenderEntity]),
    CompanyModule,
    UsersTenantModule,
    CategoryTenderModule,
    FilesModule,
  ],
  controllers: [CompanyTenderController],
  providers: [CompanyTenderService, CompanyTenderSerializationProfile],
  exports: [CompanyTenderService],
})
export class CompanyTenderModule {}
