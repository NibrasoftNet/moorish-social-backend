import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { languageEnum } from '@/enums/language.enum';

export class CreateCompanyCategoryDto {
  @ApiProperty({
    description: 'The title of the category.',
    example: 'Example Category',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The language',
    example: languageEnum['en-US'],
  })
  @IsNotEmpty()
  language: languageEnum;

  constructor({ title, language }: { title: string; language: languageEnum }) {
    this.title = title;
    this.language = language;
  }
}
