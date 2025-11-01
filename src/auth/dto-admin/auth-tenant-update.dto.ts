import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AuthTenantUpdateDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({ example: 'position' })
  @IsOptional()
  position?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  whatsApp?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notificationsToken?: string | null;
}
