import { AutoMap } from '@automapper/classes';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusesDto } from '../../statuses/dto/statuses.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { UserSocketDto } from '../../chat/dto/user-socket.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserTenantDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  tenantId: string;

  @AutoMap()
  @ApiProperty()
  email: string;

  @AutoMap(() => String)
  @ApiProperty()
  firstName: string;

  @AutoMap(() => String)
  @ApiProperty()
  lastName: string;

  @AutoMap()
  @ApiPropertyOptional({ type: String, nullable: true })
  position: string | null;

  @AutoMap()
  @ApiPropertyOptional({ type: String, nullable: true })
  whatsApp: string;

  @AutoMap(() => FileDto)
  @ApiPropertyOptional({ type: FileDto, nullable: true })
  image: FileDto;

  @AutoMap(() => RoleDto)
  @ApiProperty()
  role: string;

  @AutoMap(() => StatusesDto)
  @ApiProperty()
  status: string;

  @AutoMap(() => CompanyDto)
  @ApiPropertyOptional({ type: CompanyDto, nullable: true })
  company: CompanyDto;

  @AutoMap(() => Date)
  @ApiPropertyOptional({ nullable: true })
  deletedAt: string;

  @AutoMap()
  @ApiPropertyOptional({ type: String, nullable: true })
  notificationsToken: string;

  @AutoMap(() => UserSocketDto)
  @ApiPropertyOptional({ type: UserSocketDto, nullable: true })
  socket: UserSocketDto;
}

export class TenantApiResponseDto extends ApiResponseDto {
  @ApiProperty({ type: UserTenantDto })
  result: UserTenantDto;
}
