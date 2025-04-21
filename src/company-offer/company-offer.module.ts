import { Module } from '@nestjs/common';
import { CompanyOfferService } from './company-offer.service';
import { CompanyOfferController } from './company-offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { CompanyOfferEntity } from './entities/company-offer.entity';
import { PostCategoryModule } from '../post-category/post-category.module';
import { FilesModule } from '../files/files.module';
import { CompanyOfferSerializationProfile } from './serialization/company-offer-serialization.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyOfferEntity]),
    CompanyModule,
    UsersTenantModule,
    PostCategoryModule,
    FilesModule,
  ],
  controllers: [CompanyOfferController],
  providers: [CompanyOfferService, CompanyOfferSerializationProfile],
  exports: [CompanyOfferService],
})
export class CompanyOfferModule {}
