import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CategoryPostOfferEntity } from '../entities/category-post-offer.entity';
import { CategoryPostOfferDto } from '../dto/category-post-offer.dto';

export class CategoryPostOfferSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CategoryPostOfferEntity, CategoryPostOfferDto);
    };
  }
}
