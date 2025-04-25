import { Module } from '@nestjs/common';
import { UserTestimonialService } from './user-testimonial.service';
import { UserTestimonialController } from './user-testimonial.controller';
import { UserTestimonialSerializationProfile } from './serialization/user-testimonial-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UserTestimonialEntity } from './entities/user-testimonial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTestimonialEntity]), UsersModule],
  controllers: [UserTestimonialController],
  providers: [UserTestimonialService, UserTestimonialSerializationProfile],
})
export class UserTestimonialModule {}
