import { Injectable } from '@nestjs/common';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  typeConverter,
} from '@automapper/core';
import { UserEntity } from '../entities/user.entity';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { UserDto } from '../user/user.dto';

@Injectable()
export class UserSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        UserEntity,
        UserDto,
        forMember(
          (dto: UserDto) => dto.status,
          mapFrom((source: UserEntity) => source.status?.name),
        ),
        forMember(
          (dto: UserDto) => dto.role,
          mapFrom((source: UserEntity) => source.role?.name),
        ),
        typeConverter(Date, String, (date) => date.toDateString()),
      );
    };
  }
}
