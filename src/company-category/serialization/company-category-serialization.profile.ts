import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CompanyCategoryDto } from '../dto/company-category.dto';
import { CompanyCategoryEntity } from '../entities/company-category.entity';

export class CompanyCategorySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CompanyCategoryEntity, CompanyCategoryDto);
    };
  }
}
