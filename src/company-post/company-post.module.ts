import { Module } from '@nestjs/common';
import { CompanyPostPublicService } from './public/company-post-public.service';
import { CompanyPostPublicController } from './public/company-post-public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { CompanyPostEntity } from './entities/company-post.entity';
import { CategoryPostOfferModule } from '../category-post-offer/category-post-offer.module';
import { FilesModule } from '../files/files.module';
import { CompanyPostSerializationProfile } from './serialization/company-post-serialization.profile';
import { TenantAwareRepositoryModule } from '../utils/repository/tenant-aware';
import { CompanyPostPrivateController } from './private/company-post-private.controller';
import { CompanyPostPrivateService } from './private/company-post-private.service';

@Module({
  imports: [
    TenantAwareRepositoryModule.forEntities([CompanyPostEntity]),
    TypeOrmModule.forFeature([CompanyPostEntity]),
    CompanyModule,
    UsersTenantModule,
    CategoryPostOfferModule,
    FilesModule,
  ],
  controllers: [CompanyPostPublicController, CompanyPostPrivateController],
  providers: [
    CompanyPostPublicService,
    CompanyPostPrivateService,
    CompanyPostSerializationProfile,
  ],
})
export class CompanyPostModule {}
