import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { CompanyParticipationCompanyTenderEntity } from '../entities/company-participation-company-tender.entity';
import { CompanyParticipationCompanyTenderDto } from '../dto/company-participation-company-tender.dto';

export class CompanyParticipationCompanyTenderSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CompanyParticipationCompanyTenderEntity,
        CompanyParticipationCompanyTenderDto,
      );
    };
  }
}
