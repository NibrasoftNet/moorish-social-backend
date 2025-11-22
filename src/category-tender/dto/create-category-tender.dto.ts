import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateCategoryTenderDto {
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
