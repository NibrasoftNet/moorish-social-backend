import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryCompanyDto {
  @ApiProperty({
    example: {
      en: 'Painting',
      fr: 'Peinture',
    },
    description: 'Multilingual label object',
  })
  @IsNotEmpty()
  @IsObject()
  label: Record<string, string>;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}
