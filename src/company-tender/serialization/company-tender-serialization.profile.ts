import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { CompanyTenderEntity } from '../entities/company-tender.entity';
import { CompanyTenderDto } from '../dto/company-tender.dto';

@Injectable()
export class CompanyTenderSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CompanyTenderEntity, CompanyTenderDto);
    };
  }
}
