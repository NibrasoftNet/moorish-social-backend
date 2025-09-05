import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';

export class UpdateCompanyTenderDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Array of image URLs to delete',
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
    active,
    deleteImages,
  }: {
    title?: string;
    content?: string;
    active?: boolean;
    deleteImages?: FileDto[];
  }) {
    this.title = title;
    this.content = content;
    this.active = active;
    this.deleteImages = deleteImages;
  }
}
