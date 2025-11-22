import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SessionAdminResponseDto {
  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @AutoMap()
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenExpires: number;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  user: UserTenantDto;
}

export class SessionAdminApiResponseDto extends ApiResponseDto {
  @ApiProperty({ type: SessionAdminResponseDto })
  result: SessionAdminResponseDto;
}
