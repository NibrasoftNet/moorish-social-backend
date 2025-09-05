import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyCategoryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  value?: string;
}
