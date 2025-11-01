import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class AuthUpdateDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  userName?: string | null;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notificationsToken?: string | null;
}
