import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTokenCategoryDto } from './create-token-category.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTokenCategoryDto extends PartialType(
  CreateTokenCategoryDto,
) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
