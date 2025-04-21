import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { CompanySubscriptionTokenEntity } from '../entities/company-subscription-token.entity';
import { CompanySubscriptionTokenDto } from '@/domains/company-subscription-token/company-subscription-token.dto';

export class CompanySubscriptionTokenSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CompanySubscriptionTokenEntity,
        CompanySubscriptionTokenDto,
      );
    };
  }
}
