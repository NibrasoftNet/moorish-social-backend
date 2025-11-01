import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';

export class UpdateUserTenderDto {
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
    description: 'Array of image objects to delete',
    required: false,
    type: [FileDto],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  deleteImages?: FileDto[];
}
