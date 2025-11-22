import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryTokenDto } from './create-category-token.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCategoryTokenDto extends PartialType(
  CreateCategoryTokenDto,
) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
