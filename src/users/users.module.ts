/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AddressModule } from '../address/address.module';
import { UserSerializationProfile } from './serialization/user-serialization.profile';
import { Role } from 'src/roles/entities/role.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), AddressModule, FilesModule],
  controllers: [UsersController],
  providers: [UsersService, UserSerializationProfile],
  exports: [UsersService],
})
export class UsersModule {}
