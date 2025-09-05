import { Injectable } from '@nestjs/common';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  typeConverter,
} from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { UserTenantDto } from '../dto/user-tenant.dto';
import { UserTenantEntity } from '../entities/user-tenant.entity';

@Injectable()
export class UsersTenantSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        UserTenantEntity,
        UserTenantDto,
        forMember(
          (dto: UserTenantDto) => dto.status,
          mapFrom((source: UserTenantEntity) => source.status?.name),
        ),
        forMember(
          (dto: UserTenantDto) => dto.role,
          mapFrom((source: UserTenantEntity) => source.role?.name),
        ),
        typeConverter(Date, String, (date) => date.toDateString()),
      );
    };
  }
}
