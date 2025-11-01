import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SpecificationDto } from '@/domains/specifications.dto';

export class CreateCompanyTenderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specifications?: SpecificationDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  lastSubmissionDate: Date;
}
