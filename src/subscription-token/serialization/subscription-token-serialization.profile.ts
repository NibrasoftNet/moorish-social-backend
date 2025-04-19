import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { SubscriptionTokenEntity } from '../entities/subscription-token.entity';
import { SubscriptionTokenDto } from '@/domains/subscription-token/subscription-token.dto';

export class SubscriptionTokenSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, SubscriptionTokenEntity, SubscriptionTokenDto);
    };
  }
}
