import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CategoryTokenEntity } from '../entities/category-token.entity';
import { CategoryTokenDto } from '../dto/category-token.dto';

export class CategoryTokenSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CategoryTokenEntity, CategoryTokenDto);
    };
  }
}
