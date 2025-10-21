import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { MessageEntity } from '../entities/message.entity';
import { MessageDto } from '../dto/message.dto';

export class MessageSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, MessageEntity, MessageDto);
    };
  }
}
