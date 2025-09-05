import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';

export class UpdateCompanyOfferDto {
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
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Array of attachments to delete',
    required: false,
    type: [FileDto],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  deleteImages?: FileDto[];

  constructor({
    title,
    content,
    hashTag,
    categoryId,
    deleteImages,
  }: {
    title?: string;
    content?: string;
    hashTag?: string;
    categoryId?: string;
    deleteImages?: FileDto[];
  }) {
    this.title = title;
    this.content = content;
    this.hashTag = hashTag;
    this.categoryId = categoryId;
    this.deleteImages = deleteImages;
  }
}
