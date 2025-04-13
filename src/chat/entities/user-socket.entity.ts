import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { UserTenant } from '../../users-tenant/entities/user-tenant.entity';

@Entity()
export class UserSocket extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => User)
  @OneToOne(() => User, (user) => user.socket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @AutoMap(() => UserTenant)
  @OneToOne(() => UserTenant, (userTenant) => userTenant.socket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_tenant_id' })
  @Index()
  userTenant: UserTenant;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, unique: true })
  socketId: string;
}
