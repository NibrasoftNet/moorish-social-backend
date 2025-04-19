import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { AddressSerializationProfile } from './serialization/address-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [AddressService, AddressSerializationProfile],
  exports: [AddressService, AddressSerializationProfile],
})
export class AddressModule {}
