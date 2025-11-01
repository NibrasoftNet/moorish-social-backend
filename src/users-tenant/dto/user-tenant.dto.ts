import { AutoMap } from '@automapper/classes';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusesDto } from '../../statuses/dto/statuses.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { UserSocketDto } from '../../chat/dto/user-socket.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  position: string;

  @AutoMap()
  @ApiProperty()
  whatsApp: string;

  @AutoMap(() => FileDto)
  @ApiProperty()
  image: FileDto;

  @AutoMap(() => RoleDto)
  @ApiProperty()
  role: string;

  @AutoMap(() => StatusesDto)
  @ApiProperty()
  status: string;

  @AutoMap(() => CompanyDto)
  @ApiProperty()
  company: CompanyDto;

  @AutoMap(() => Date)
  @ApiProperty()
  deletedAt: string;

  @AutoMap()
  @ApiProperty()
  notificationsToken: string;

  @AutoMap(() => UserSocketDto)
  @ApiProperty()
  socket: UserSocketDto;
}

export class TenantApiResponseDto extends ApiResponseDto {
  @ApiProperty({ type: UserTenantDto })
  result: UserTenantDto;
}
