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
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';
import { UserTenant } from '../entities/user-tenant.entity';

@Injectable()
export class UsersTenantSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        UserTenant,
        UserTenantDto,
        forMember(
          (dto: UserTenantDto) => dto.status,
          mapFrom((source: UserTenant) => source.status?.name),
        ),
        forMember(
          (dto: UserTenantDto) => dto.role,
          mapFrom((source: UserTenant) => source.role?.name),
        ),
        typeConverter(Date, String, (date) => date.toDateString()),
      );
    };
  }
}
