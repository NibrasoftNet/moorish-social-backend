import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryCompanyDto {
  @ApiPropertyOptional({
    example: {
      en: 'Painting',
      fr: 'Peinture',
    },
    description: 'Multilingual label object',
  })
  @IsOptional()
  @IsObject()
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value?: string;
}
