import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { CompanyEntity } from '../../company/entities/company.entity';
import { TokenCategoryEntity } from '../../token-category/entities/token-category.entity';

@Entity()
export class CompanySubscriptionTokenEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  tenantId: string;

  @AutoMap(() => CompanyEntity)
  @ManyToOne(() => CompanyEntity, (company) => company.subscriptions, {
    nullable: false,
  })
  company: CompanyEntity;

  @AutoMap(() => TokenCategoryEntity)
  @ManyToOne(() => TokenCategoryEntity, {
    eager: true,
    nullable: false,
  })
  category: TokenCategoryEntity;
}
