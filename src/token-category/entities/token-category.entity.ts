import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity()
export class TokenCategoryEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @AutoMap()
  @Column({ type: 'int' })
  value: number;

  @AutoMap()
  @Column({ type: 'int' })
  price: number;

  @AutoMap()
  @Column({ default: true })
  active: boolean;
}
