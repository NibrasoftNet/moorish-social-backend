import { Module } from '@nestjs/common';
import { UserTenderService } from './user-tender.service';
import { UserTenderController } from './user-tender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTenderEntity } from './entities/user-tender.entity';
import { UsersModule } from '../users/users.module';
import { CategoryTenderModule } from '../category-tender/category-tender.module';
import { FilesModule } from '../files/files.module';
import { UserTenderSerializationProfile } from './serialization/user-tender-serialization.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTenderEntity]),
    UsersModule,
    CategoryTenderModule,
    FilesModule,
  ],
  controllers: [UserTenderController],
  providers: [UserTenderService, UserTenderSerializationProfile],
  exports: [UserTenderService],
})
export class UserTenderModule {}
