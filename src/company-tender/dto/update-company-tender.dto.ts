import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { Type } from 'class-transformer';
import { SpecificationDto } from '@/domains/specifications.dto';

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

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specifications?: SpecificationDto[];

  @ApiProperty()
  @IsOptional()
  @IsDate()
  lastSubmissionDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalParticipation?: number;

  constructor({
    title,
    content,
    active,
    deleteImages,
    specifications,
    lastSubmissionDate,
    totalParticipation,
  }: {
    title?: string;
    content?: string;
    active?: boolean;
    deleteImages?: FileDto[];
    specifications?: SpecificationDto[];
    lastSubmissionDate?: Date;
    totalParticipation?: number;
  }) {
    this.title = title;
    this.content = content;
    this.active = active;
    this.deleteImages = deleteImages;
    this.specifications = specifications;
    this.lastSubmissionDate = lastSubmissionDate;
    this.totalParticipation = totalParticipation;
  }
}
