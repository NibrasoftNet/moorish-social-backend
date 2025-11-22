import { Module } from '@nestjs/common';
import { CategoryCompanyService } from './category-company.service';
import { CategoryCompanyController } from './category-company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../files/files.module';
import { CategoryCompanySerializationProfile } from './serialization/category-company-serialization.profile';
import { CategoryCompanyEntity } from './entities/category-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryCompanyEntity]), FilesModule],
  controllers: [CategoryCompanyController],
  providers: [CategoryCompanyService, CategoryCompanySerializationProfile],
  exports: [CategoryCompanyService],
})
export class CategoryCompanyModule {}
