import { UserEntity } from '../../../users/entities/user.entity';

export type JwtPayloadType = Pick<UserEntity, 'id' | 'role'> & {
  id: UserEntity['id'];
  role: UserEntity['role'];
  iat: number;
  exp: number;
};
