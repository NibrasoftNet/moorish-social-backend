import { AutoMap } from '@automapper/classes';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusesDto } from '../../statuses/dto/statuses.dto';
import { AddressDto } from '../../address/dto/address.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { UserSocketDto } from '../../chat/dto/user-socket.dto';

export class UserDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  userName: string;

  @AutoMap(() => FileDto)
  photo: FileDto;

  @AutoMap(() => RoleDto)
  role: string;

  @AutoMap(() => StatusesDto)
  status: string;

  @AutoMap(() => AddressDto)
  address: AddressDto;

  @AutoMap(() => Date)
  deletedAt: string;

  @AutoMap(() => String)
  provider: string;

  @AutoMap(() => String)
  notificationsToken: string;

  @AutoMap(() => UserSocketDto)
  socket: UserSocketDto;
}
