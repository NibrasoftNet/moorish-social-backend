import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from '@automapper/classes';
import { CompanyEntity } from '../../company/entities/company.entity';
import { CategoryTokenEntity } from '../../category-token/entities/category-token.entity';

@Entity({ name: 'company_subscription_token' })
export class CompanySubscriptionTokenEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  tenantId: string;

  @AutoMap(() => CompanyEntity)
  @ManyToOne(() => CompanyEntity, {
    nullable: false,
  })
  company: CompanyEntity;

  @AutoMap(() => CategoryTokenEntity)
  @ManyToOne(() => CategoryTokenEntity, {
    eager: true,
    nullable: false,
  })
  category: CategoryTokenEntity;
}
