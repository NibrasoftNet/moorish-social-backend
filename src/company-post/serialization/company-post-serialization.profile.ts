import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { CompanyPostEntity } from '../entities/company-post.entity';
import { CompanyPostDto } from '../dto/company-post.dto';

export class CompanyPostSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CompanyPostEntity, CompanyPostDto);
    };
  }
}
