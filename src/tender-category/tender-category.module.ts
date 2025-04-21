import { Module } from '@nestjs/common';
import { TenderCategoryService } from './tender-category.service';
import { TenderCategoryController } from './tender-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenderCategoryEntity } from './entities/tender-category.entity';
import { TenderCategorySerializationProfile } from './serialization/tender-category-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([TenderCategoryEntity])],
  controllers: [TenderCategoryController],
  providers: [TenderCategoryService, TenderCategorySerializationProfile],
  exports: [TenderCategoryService],
})
export class TenderCategoryModule {}
