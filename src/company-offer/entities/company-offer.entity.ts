import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import { AutoMap } from '@automapper/classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { CompanyEntity } from '../../company/entities/company.entity';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';
import { PostCategoryEntity } from '../../post-category/entities/post-category.entity';
import { UserRequestOfferEntity } from '../../user-request-offer/entities/user-request-offer.entity';

@Entity({ name: 'company_offer' })
export class CompanyOfferEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => [FileEntity])
  @ManyToMany(() => FileEntity, { eager: true })
  @JoinTable()
  files: FileEntity[];

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
  @Column({ default: 10 })
  boostScore: number;

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
    onDelete: 'CASCADE',
    nullable: false,
  })
  category: PostCategoryEntity;

  @AutoMap(() => UserRequestOfferEntity)
  @OneToMany(() => UserRequestOfferEntity, (request) => request.offer, {
    nullable: false,
  })
  request: UserRequestOfferEntity;

  @AutoMap()
  @Column({ default: true })
  active: boolean;
}
