import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  boostScore?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  constructor({
    title,
    content,
    hashTag,
    boostScore,
    active,
  }: {
    title?: string;
    content?: string;
    hashTag?: string;
    boostScore?: number;
    active?: boolean;
  }) {
    this.title = title;
    this.content = content;
    this.hashTag = hashTag;
    this.boostScore = boostScore;
    this.active = active;
  }
}
