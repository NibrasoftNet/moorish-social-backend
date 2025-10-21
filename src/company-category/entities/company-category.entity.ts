import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity({ name: 'company_category' })
export class CompanyCategoryEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  label: string;

  @AutoMap()
  @Column()
  value: string;

  @AutoMap(() => CompanyCategoryEntity)
  @ManyToOne(() => CompanyCategoryEntity, (category) => category.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent: CompanyCategoryEntity | null;

  @AutoMap(() => [CompanyCategoryEntity])
  @OneToMany(() => CompanyCategoryEntity, (category) => category.parent)
  children: CompanyCategoryEntity[];
}
