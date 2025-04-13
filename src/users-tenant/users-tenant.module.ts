/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersTenantService } from './users-tenant.service';
import { UsersTenantController } from './users-tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';

import { UsersTenantSerializationProfile } from './serialization/user-tenant-serialization.profile';
import { FilesModule } from '../files/files.module';
import { UserTenant } from './entities/user-tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTenant]), FilesModule],
  controllers: [UsersTenantController],
  providers: [
    IsExist,
    IsNotExist,
    UsersTenantService,
    UsersTenantSerializationProfile,
  ],
  exports: [UsersTenantService],
})
export class UsersTenantModule {}
