import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserRequestOfferDto } from './create-user-request-offer.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestOfferDto extends PartialType(
  CreateUserRequestOfferDto,
) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  response: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  closed?: boolean;
}
