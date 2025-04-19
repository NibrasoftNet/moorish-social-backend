import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyPostDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  hashTag?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;

  constructor({
    title,
    content,
    hashTag,
  }: {
    title?: string;
    content?: string;
    hashTag?: string;
  }) {
    this.title = title;
    this.content = content;
    this.hashTag = hashTag;
  }
}
