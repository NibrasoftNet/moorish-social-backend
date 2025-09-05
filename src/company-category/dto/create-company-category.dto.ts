import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}
