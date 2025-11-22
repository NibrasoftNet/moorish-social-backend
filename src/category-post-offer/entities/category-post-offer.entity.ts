import { AutoMap } from '@automapper/classes';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity({ name: 'category_post_offer' })
export class CategoryPostOfferEntity extends EntityHelper {
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
}
