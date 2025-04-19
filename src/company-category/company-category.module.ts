import { Module } from '@nestjs/common';
import { CompanyCategoryService } from './company-category.service';
import { CompanyCategoryController } from './company-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../files/files.module';
import { CompanyCategorySerializationProfile } from './serialization/company-category-serialization.profile';
import { CompanyCategoryEntity } from './entities/company-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyCategoryEntity]), FilesModule],
  controllers: [CompanyCategoryController],
  providers: [CompanyCategoryService, CompanyCategorySerializationProfile],
  exports: [CompanyCategoryService],
})
export class CompanyCategoryModule {}
