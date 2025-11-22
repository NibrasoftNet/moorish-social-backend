import { Module } from '@nestjs/common';
import { CategoryTenderService } from './category-tender.service';
import { CategoryTenderController } from './category-tender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTenderEntity } from './entities/category-tender.entity';
import { Category_tenderSerializationProfile } from './serialization/category_tender-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryTenderEntity])],
  controllers: [CategoryTenderController],
  providers: [CategoryTenderService, Category_tenderSerializationProfile],
  exports: [CategoryTenderService],
})
export class CategoryTenderModule {}
