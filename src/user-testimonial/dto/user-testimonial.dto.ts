import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { UserDto } from '../../users/user/user.dto';
import { Expose } from 'class-transformer';

export class UserTestimonialDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  comment: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  rate: number;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  user: UserDto;
}
