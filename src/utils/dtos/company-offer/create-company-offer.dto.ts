import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyOfferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hashTag: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  constructor({
    title,
    content,
    hashTag,
  }: {
    title: string;
    content: string;
    hashTag: string;
  }) {
    this.title = title;
    this.content = content;
    this.hashTag = hashTag;
  }
}
