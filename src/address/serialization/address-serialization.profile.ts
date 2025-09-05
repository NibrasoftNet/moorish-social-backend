import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { AddressEntity } from '../entities/address.entity';
import { AddressDto } from '../dto/address.dto';

@Injectable()
export class AddressSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, AddressEntity, AddressDto);
    };
  }
}
