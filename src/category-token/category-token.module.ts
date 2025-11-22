import { Module } from '@nestjs/common';
import { CategoryTokenService } from './category-token.service';
import { CategoryTokenController } from './category-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTokenEntity } from './entities/category-token.entity';
import { CategoryTokenSerializationProfile } from './serialization/category-token-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryTokenEntity])],
  controllers: [CategoryTokenController],
  providers: [CategoryTokenService, CategoryTokenSerializationProfile],
  exports: [CategoryTokenService],
})
export class CategoryTokenModule {}
