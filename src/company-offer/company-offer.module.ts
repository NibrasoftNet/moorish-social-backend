import { Module } from '@nestjs/common';
import { CompanyOfferPublicService } from './public/company-offer-public.service';
import { CompanyOfferPublicController } from './public/company-offer-public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { CompanyOfferEntity } from './entities/company-offer.entity';
import { PostCategoryModule } from '../post-category/post-category.module';
import { FilesModule } from '../files/files.module';
import { CompanyOfferSerializationProfile } from './serialization/company-offer-serialization.profile';
import { CompanyOfferPrivateService } from './private/company-offer-private.service';
import { TenantAwareRepositoryModule } from '../utils/repository/tenant-aware';
import { CompanyOfferPrivateController } from './private/company-offer-private.controller';

@Module({
  imports: [
    TenantAwareRepositoryModule.forEntities([CompanyOfferEntity]),
    TypeOrmModule.forFeature([CompanyOfferEntity]),
    CompanyModule,
    UsersTenantModule,
    PostCategoryModule,
    FilesModule,
  ],
  controllers: [CompanyOfferPublicController, CompanyOfferPrivateController],
  providers: [
    CompanyOfferPublicService,
    CompanyOfferPrivateService,
    CompanyOfferSerializationProfile,
  ],
  exports: [CompanyOfferPublicService, CompanyOfferPrivateService],
})
export class CompanyOfferModule {}
