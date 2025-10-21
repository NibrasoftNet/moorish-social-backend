import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { NotificationRecipientEntity } from '../entities/notification-recipient.entity';
import { NotificationRecipientDto } from '../dto/notification-recipient.dto';

export class NotificationRecipientSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, NotificationRecipientEntity, NotificationRecipientDto);
    };
  }
}
