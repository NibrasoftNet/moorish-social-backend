import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity()
export class TenderCategoryEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  name: string;
}
