import { PartialType } from '@nestjs/swagger';
import { CreateCategoryPostOfferDto } from './create-category-post-offer.dto';

export class UpdateCategoryPostOfferDto extends PartialType(
  CreateCategoryPostOfferDto,
) {}
