import { Injectable } from '@nestjs/common';

import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { UserTenderDto } from '../dto/user-tender.dto';
import { UserTenderEntity } from '../entities/user-tender.entity';

@Injectable()
export class UserTenderSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserTenderEntity, UserTenderDto);
    };
  }
}
