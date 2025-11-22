import { Module } from '@nestjs/common';
import { CategoryPostOfferService } from './category-post-offer.service';
import { CategoryPostOfferController } from './category-post-offer.controller';
import { CategoryPostOfferSerializationProfile } from './serialization/category-post-offer-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryPostOfferEntity } from './entities/category-post-offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryPostOfferEntity])],
  controllers: [CategoryPostOfferController],
  providers: [CategoryPostOfferService, CategoryPostOfferSerializationProfile],
  exports: [CategoryPostOfferService],
})
export class CategoryPostOfferModule {}
