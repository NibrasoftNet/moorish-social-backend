import { Module } from '@nestjs/common';
import { UsersTenantService } from './users-tenant.service';
import { UsersTenantController } from './users-tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTenantSerializationProfile } from './serialization/user-tenant-serialization.profile';
import { FilesModule } from '../files/files.module';
import { UserTenantEntity } from './entities/user-tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTenantEntity]), FilesModule],
  controllers: [UsersTenantController],
  providers: [UsersTenantService, UsersTenantSerializationProfile],
  exports: [UsersTenantService],
})
export class UsersTenantModule {}
