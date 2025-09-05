import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { CompanyOfferEntity } from '../entities/company-offer.entity';
import { CompanyOfferDto } from '../dto/company-offer.dto';

export class CompanyOfferSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CompanyOfferEntity, CompanyOfferDto);
    };
  }
}
