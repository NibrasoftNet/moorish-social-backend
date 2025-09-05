import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/user/user.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';

export class UserSocketDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  user: UserDto;

  @AutoMap()
  socketId: string;
}
