import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { CompanyParticipationUserTenderDto } from '@/domains/company-participation-user-tender/company-participation-user-tender.dto';
import { CompanyParticipationUserTenderEntity } from '../entities/company-participation-user-tender.entity';

export class CompanyOfferUserTenderSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CompanyParticipationUserTenderEntity,
        CompanyParticipationUserTenderDto,
      );
    };
  }
}
