import { PartialType } from '@nestjs/swagger';
import { CreateCategoryTenderDto } from './create-category-tender.dto';

export class UpdateCategoryTenderDto extends PartialType(
  CreateCategoryTenderDto,
) {}
