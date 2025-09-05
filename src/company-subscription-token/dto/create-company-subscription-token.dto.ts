import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanySubscriptionTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
