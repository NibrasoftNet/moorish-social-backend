import { PartialType } from '@nestjs/swagger';
import { CreateUserTestimonialDto } from './create-user-testimonial.dto';

export class UpdateUserTestimonialDto extends PartialType(
  CreateUserTestimonialDto,
) {}
