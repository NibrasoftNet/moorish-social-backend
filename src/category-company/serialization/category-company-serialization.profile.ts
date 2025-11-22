import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CategoryCompanyDto } from '../dto/category-company.dto';
import { CategoryCompanyEntity } from '../entities/category-company.entity';

export class CategoryCompanySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CategoryCompanyEntity, CategoryCompanyDto);
    };
  }
}
