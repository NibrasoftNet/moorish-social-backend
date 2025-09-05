import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import bcrypt from 'bcryptjs';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../files/entities/file.entity';
import { UserSocketEntity } from '../../chat/entities/user-socket.entity';
import { CompanyEntity } from '../../company/entities/company.entity';

@Entity({ name: 'user_tenant' })
export class UserTenantEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: String, nullable: false })
  tenantId: string;

  @AutoMap()
  @Column({ type: String, unique: true, nullable: false })
  email: string;

  @AutoMap()
  @Column({ nullable: true, type: String })
  password: string;

  public previousPassword: string;

  @AutoMap(() => String)
  @Column({ type: String, nullable: false })
  firstName: string;

  @AutoMap(() => String)
  @Column({ type: String, nullable: false })
  lastName: string;

  @AutoMap()
  @Column({ nullable: true, type: String, default: '0123456789' })
  whatsApp: string;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  image?: FileEntity | null;

  @AutoMap(() => Role)
  @ManyToOne(() => Role, {
    eager: true,
  })
  role: Role;

  @AutoMap(() => Status)
  @ManyToOne(() => Status, {
    eager: true,
  })
  status: Status;

  @AutoMap(() => CompanyEntity)
  @ManyToOne(() => CompanyEntity, (company) => company.tenants, {
    eager: true,
    onDelete: 'SET NULL',
  })
  company: CompanyEntity;

  @DeleteDateColumn()
  deletedAt: Date;

  @AutoMap()
  @Column({ type: String, nullable: true })
  notificationsToken?: string | null;

  @AutoMap(() => UserSocketEntity)
  @OneToOne(() => UserSocketEntity, (socket) => socket.userTenant, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  socket: UserSocketEntity;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
