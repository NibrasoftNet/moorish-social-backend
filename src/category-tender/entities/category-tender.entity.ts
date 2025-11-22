import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity({ name: 'category_tender' })
export class CategoryTenderEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => [Object])
  @Column({ type: 'jsonb', nullable: false })
  label: Record<string, string>;

  @AutoMap()
  @Column()
  value: string;
}
