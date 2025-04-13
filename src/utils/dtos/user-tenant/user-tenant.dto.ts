import { AutoMap } from 'automapper-classes';
import { FileDto } from '@/domains/files/file.dto';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserSocketDto } from '@/domains/chat/user-socket.dto';

export class UserTenantDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  userName: string;

  @AutoMap()
  whatsApp: string;

  @AutoMap(() => FileDto)
  photo: FileDto;

  @AutoMap(() => RoleDto)
  role: string;

  @AutoMap(() => StatusesDto)
  status: string;

  @AutoMap(() => Date)
  deletedAt: string;

  @AutoMap()
  notificationsToken: string;

  @AutoMap(() => Date)
  subscriptionExpiryDate: Date;

  @AutoMap(() => UserSocketDto)
  socket: UserSocketDto;
}
