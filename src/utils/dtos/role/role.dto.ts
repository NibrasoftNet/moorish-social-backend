import { AutoMap } from 'automapper-classes';
import { Validate } from 'class-validator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { IsExist } from '../../validators/is-exists.validator';

export class RoleDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  @Validate(IsExist, ['Role', 'code', 'validation.roleNotExists'])
  code: RoleCodeEnum;
}
