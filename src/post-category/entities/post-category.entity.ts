import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { CompanyPostEntity } from '../../company-post/entities/company-post.entity';

@Entity()
export class PostCategoryEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  name: string;

  @AutoMap(() => [CompanyPostEntity])
  @OneToMany(() => CompanyPostEntity, (post) => post.category, {
    nullable: true,
  })
  posts: CompanyPostEntity[];
}
