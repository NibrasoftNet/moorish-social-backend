import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity({ name: 'category_company' })
export class CategoryCompanyEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => [Object])
  @Column({
    type: 'jsonb',
    nullable: false,
    default: () => `'{"en": "Construction", "fr": "Construction"}'`,
  })
  label: Record<string, string>;

  @AutoMap()
  @Column()
  value: string;

  @AutoMap(() => CategoryCompanyEntity)
  @ManyToOne(() => CategoryCompanyEntity, (category) => category.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent: CategoryCompanyEntity | null;

  @AutoMap(() => [CategoryCompanyEntity])
  @OneToMany(() => CategoryCompanyEntity, (category) => category.parent)
  children: CategoryCompanyEntity[];
}
