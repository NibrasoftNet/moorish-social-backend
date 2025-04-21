import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { CompanyOfferEntity } from '../entities/company-offer.entity';
import { CompanyPostDto } from '@/domains/company-post/company-post.dto';

export class CompanyOfferSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CompanyOfferEntity, CompanyPostDto);
    };
  }
}
