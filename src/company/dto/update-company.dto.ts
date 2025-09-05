import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class UpdateCompanyDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  constructor({
    name,
    description,
    address,
  }: {
    name?: string;
    description?: string;
    address?: CreateAddressDto;
  }) {
    this.name = name;
    this.description = description;
    this.address = address;
  }
}
