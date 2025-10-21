import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from '@automapper/classes';
import { FileEntity } from '../../files/entities/file.entity';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';
import { AddressEntity } from '../../address/entities/address.entity';
import { CompanyCategoryEntity } from '../../company-category/entities/company-category.entity';

@Entity({ name: 'company' })
export class CompanyEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: String, nullable: false })
  tenantId: string;

  @AutoMap(() => String)
  @Column({ type: String, nullable: false })
  name: string;

  @AutoMap(() => String)
  @Column({ type: String, nullable: false })
  description: string;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  registrationNumber: string;

  @AutoMap(() => [UserTenantEntity])
  @OneToMany(() => UserTenantEntity, (tenant) => tenant.company, {
    nullable: true,
  })
  tenants: UserTenantEntity[];

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  image?: FileEntity | null;

  @AutoMap(() => AddressEntity)
  @OneToOne(() => AddressEntity, (address) => address.id, {
    eager: true,
  })
  @JoinColumn()
  address: AddressEntity;

  @AutoMap()
  @Column({ type: Number, nullable: false, default: 100 })
  availableSubscriptionTokens: number;

  @AutoMap(() => [CompanyCategoryEntity])
  @ManyToMany(() => CompanyCategoryEntity, {
    eager: true,
    nullable: false,
  })
  @JoinTable()
  categories: CompanyCategoryEntity[];

  @AutoMap()
  @Column({ type: 'varchar', length: 7, default: '#5bb450' })
  hexColor: string;

  @AutoMap()
  @Column({ default: false })
  verified: boolean;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @DeleteDateColumn()
  deletedAt: Date;
}
