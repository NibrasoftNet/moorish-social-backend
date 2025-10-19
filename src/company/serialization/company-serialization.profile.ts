import { Injectable } from '@nestjs/common';
import {
  createMap,
  Mapper,
  MappingProfile,
  typeConverter,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CompanyEntity } from '../entities/company.entity';
import { CompanyDto } from '../dto/company.dto';

@Injectable()
export class CompanySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CompanyEntity,
        CompanyDto,
        typeConverter(Date, String, (date) => date.toDateString()),
      );
    };
  }
}
