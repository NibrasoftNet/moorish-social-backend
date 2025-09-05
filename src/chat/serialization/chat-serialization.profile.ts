import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { ChatEntity } from '../entities/chat.entity';
import { ChatDto } from '../dto/chat.dto';

export class ChatSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, ChatEntity, ChatDto);
    };
  }
}
