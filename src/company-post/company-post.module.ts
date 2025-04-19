import { Module } from '@nestjs/common';
import { CompanyPostService } from './company-post.service';
import { CompanyPostController } from './company-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { CompanyPostEntity } from './entities/company-post.entity';
import { PostCategoryModule } from '../post-category/post-category.module';
import { FilesModule } from '../files/files.module';
import { CompanyPostSerializationProfile } from './serialization/company-post-serialization.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyPostEntity]),
    CompanyModule,
    UsersTenantModule,
    PostCategoryModule,
    FilesModule,
  ],
  controllers: [CompanyPostController],
  providers: [CompanyPostService, CompanyPostSerializationProfile],
})
export class CompanyPostModule {}
