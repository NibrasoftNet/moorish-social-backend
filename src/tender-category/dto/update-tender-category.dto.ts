import { PartialType } from '@nestjs/swagger';
import { CreateTenderCategoryDto } from './create-tender-category.dto';

export class UpdateTenderCategoryDto extends PartialType(
  CreateTenderCategoryDto,
) {}
