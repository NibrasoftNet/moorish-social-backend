import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsHexColor,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from '../address/create-address.dto';

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @ApiProperty({ example: '#ffffff' })
  @IsNotEmpty()
  @IsHexColor()
  hexColor: string;

  constructor({
    name,
    description,
    address,
    hexColor,
  }: {
    name: string;
    description: string;
    address: CreateAddressDto;
    hexColor: string;
  }) {
    this.name = name;
    this.description = description;
    this.address = address;
    this.hexColor = hexColor;
  }
}
