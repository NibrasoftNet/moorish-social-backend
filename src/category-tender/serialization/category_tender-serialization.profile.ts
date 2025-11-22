import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CategoryTenderDto } from '../dto/category-tender.dto';
import { CategoryTenderEntity } from '../entities/category-tender.entity';

export class Category_tenderSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CategoryTenderEntity, CategoryTenderDto);
    };
  }
}
