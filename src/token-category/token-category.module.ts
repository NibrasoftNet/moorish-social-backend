import { Module } from '@nestjs/common';
import { TokenCategoryService } from './token-category.service';
import { TokenCategoryController } from './token-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenCategoryEntity } from './entities/token-category.entity';
import { TokenCategorySerializationProfile } from './serialization/token-category-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([TokenCategoryEntity])],
  controllers: [TokenCategoryController],
  providers: [TokenCategoryService, TokenCategorySerializationProfile],
  exports: [TokenCategoryService],
})
export class TokenCategoryModule {}
