import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class AuthTenantUpdateDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Chief' })
  @IsOptional()
  position?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  whatsApp?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notificationsToken?: string;

  constructor({
    firstName,
    lastName,
    position,
    whatsApp,
    notificationsToken,
  }: {
    firstName?: string;
    lastName?: string;
    position?: string;
    whatsApp?: string;
    notificationsToken?: string;
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.position = position;
    this.whatsApp = whatsApp;
    this.notificationsToken = notificationsToken;
  }
}
