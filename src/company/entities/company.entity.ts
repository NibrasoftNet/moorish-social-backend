import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../files/entities/file.entity';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';
import { CompanySubscriptionTokenEntity } from '../../company-subscription-token/entities/company-subscription-token.entity';
import { AddressEntity } from '../../address/entities/address.entity';
import { CompanyCategoryEntity } from '../../company-category/entities/company-category.entity';

@Entity()
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

  @AutoMap(() => [CompanySubscriptionTokenEntity])
  @OneToMany(() => CompanySubscriptionTokenEntity, (tenant) => tenant.company, {
    eager: true,
    nullable: true,
  })
  subscriptions: CompanySubscriptionTokenEntity[];

  @AutoMap(() => CompanyCategoryEntity)
  @ManyToOne(() => CompanyCategoryEntity, (category) => category.companies, {
    eager: true,
    nullable: false,
  })
  category: CompanyCategoryEntity;

  @AutoMap()
  @Column({ type: 'varchar', length: 7, default: '#5bb450' })
  hexColor: string;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @DeleteDateColumn()
  deletedAt: Date;
}
