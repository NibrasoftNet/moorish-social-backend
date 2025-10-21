import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { PostCategoryEntity } from '../entities/post-category.entity';
import { PostCategoryDto } from '../dto/post-category.dto';

export class PostCategorySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PostCategoryEntity, PostCategoryDto);
    };
  }
}
