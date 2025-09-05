import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

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

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  constructor({
    name,
    description,
    address,
    hexColor,
    categories,
    registrationNumber,
  }: {
    name: string;
    description: string;
    address: CreateAddressDto;
    hexColor: string;
    categories: string[];
    registrationNumber?: string;
  }) {
    this.name = name;
    this.description = description;
    this.address = address;
    this.hexColor = hexColor;
    this.categories = categories;
    this.registrationNumber = registrationNumber;
  }
}
