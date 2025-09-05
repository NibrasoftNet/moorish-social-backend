import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestOfferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  request: string;
}
