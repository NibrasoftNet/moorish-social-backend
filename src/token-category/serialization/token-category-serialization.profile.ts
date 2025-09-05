import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { TokenCategoryEntity } from '../entities/token-category.entity';
import { TokenCategoryDto } from '../dto/token-category.dto';

export class TokenCategorySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, TokenCategoryEntity, TokenCategoryDto);
    };
  }
}
