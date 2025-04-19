import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressSeedService } from './address-seed.service';
import { AddressEntity } from '../../../address/entities/address.entity';
import { AddressFactory } from './address.factory';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressSeedService, AddressFactory],
  exports: [AddressSeedService, AddressFactory],
})
export class AddressSeedModule {}
