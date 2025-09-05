import { AutoMap } from 'automapper-classes';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusesDto } from '../../statuses/dto/statuses.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { UserSocketDto } from '../../chat/dto/user-socket.dto';
import { CompanyDto } from '../../company/dto/company.dto';

export class UserTenantDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  tenantId: string;

  @AutoMap()
  email: string;

  @AutoMap(() => String)
  firstName: string;

  @AutoMap(() => String)
  lastName: string;

  @AutoMap()
  whatsApp: string;

  @AutoMap(() => FileDto)
  image: FileDto;

  @AutoMap(() => RoleDto)
  role: string;

  @AutoMap(() => StatusesDto)
  status: string;

  @AutoMap(() => CompanyDto)
  company: CompanyDto;

  @AutoMap(() => Date)
  deletedAt: string;

  @AutoMap()
  notificationsToken: string;

  @AutoMap(() => UserSocketDto)
  socket: UserSocketDto;
}
