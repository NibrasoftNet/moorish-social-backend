import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { UserTestimonialEntity } from '../entities/user-testimonial.entity';
import { UserTestimonialDto } from '@/domains/user-testimonial/user-testimonial.dto';

export class UserTestimonialSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserTestimonialEntity, UserTestimonialDto);
    };
  }
}
