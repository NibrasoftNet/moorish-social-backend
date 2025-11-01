import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatusEnum } from '@/enums/request-status.enum';
import { FileDto } from '../../files/dto/file.dto';

export class UpdateCompanyParticipationCompanyTenderDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RequestStatusEnum)
  status?: RequestStatusEnum;

  @ApiProperty({
    description: 'Array of image URLs to delete',
    required: false,
    type: [FileDto],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  deleteImages?: FileDto[];
}
