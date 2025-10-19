import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';

export class SessionAdminResponseDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  tokenExpires: number;

  @AutoMap()
  @IsNotEmpty()
  user: UserTenantDto;

  constructor({
    accessToken,
    refreshToken,
    tokenExpires,
    user,
  }: {
    accessToken: string;
    refreshToken: string;
    tokenExpires: number;
    user: UserTenantDto;
  }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpires = tokenExpires;
    this.user = user;
  }
}
