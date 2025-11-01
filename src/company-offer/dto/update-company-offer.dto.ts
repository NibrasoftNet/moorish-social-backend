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
}
