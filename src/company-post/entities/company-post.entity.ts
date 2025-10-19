import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import { AutoMap } from '@automapper/classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { CompanyEntity } from '../../company/entities/company.entity';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';
import { PostCategoryEntity } from '../../post-category/entities/post-category.entity';

@Entity({ name: 'company_post' })
export class CompanyPostEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => [FileEntity])
  @ManyToMany(() => FileEntity, { eager: true })
  @JoinTable()
  images: FileEntity[];

  @AutoMap()
  @Column({ nullable: false })
  title: string;

  @AutoMap()
  @Column('text', { nullable: false })
  content: string;

  @AutoMap()
  @Column({ nullable: false })
  hashTag: string;

  @AutoMap()
  @Column({ default: 0 })
  boostScore: number;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => CompanyEntity)
  @ManyToOne(() => CompanyEntity, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  company: CompanyEntity;

  @AutoMap(() => UserTenantEntity)
  @ManyToOne(() => UserTenantEntity, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  creator: UserTenantEntity;

  @AutoMap(() => PostCategoryEntity)
  @ManyToOne(() => PostCategoryEntity, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: false,
  })
  category: PostCategoryEntity;
}
