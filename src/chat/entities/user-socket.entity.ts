import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';

@Entity()
export class UserSocketEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => UserEntity)
  @OneToOne(() => UserEntity, (user) => user.socket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: UserEntity;

  @AutoMap(() => UserTenantEntity)
  @OneToOne(() => UserTenantEntity, (userTenant) => userTenant.socket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_tenant_id' })
  @Index()
  userTenant: UserTenantEntity;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, unique: true })
  socketId: string;
}
