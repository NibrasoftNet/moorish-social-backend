import { Module } from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { PostCategoryController } from './post-category.controller';
import { PostCategorySerializationProfile } from './serialization/post-category-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategoryEntity } from './entities/post-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategoryEntity])],
  controllers: [PostCategoryController],
  providers: [PostCategoryService, PostCategorySerializationProfile],
  exports: [PostCategoryService],
})
export class PostCategoryModule {}
