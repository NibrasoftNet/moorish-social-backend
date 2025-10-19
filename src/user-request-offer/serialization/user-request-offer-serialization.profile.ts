import { Injectable } from '@nestjs/common';

import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { UserRequestOfferEntity } from '../entities/user-request-offer.entity';
import { UserRequestOfferDto } from '../dto/user-request-offer.dto';

@Injectable()
export class UserRequestOfferSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserRequestOfferEntity, UserRequestOfferDto);
    };
  }
}
