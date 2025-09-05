import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { TenderCategoryDto } from '../dto/tender-category.dto';
import { TenderCategoryEntity } from '../entities/tender-category.entity';

export class TenderCategorySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, TenderCategoryEntity, TenderCategoryDto);
    };
  }
}
