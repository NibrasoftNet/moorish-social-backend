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
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { TenderCategoryEntity } from '../../tender-category/entities/tender-category.entity';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';
import { CompanyParticipationCompanyTenderEntity } from '../../company-participation-company-tender/entities/company-participation-company-tender.entity';
import { CompanyEntity } from '../../company/entities/company.entity';

@Entity({ name: 'company_tender' })
export class CompanyTenderEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => [FileEntity])
  @ManyToMany(() => FileEntity, { eager: true })
  @JoinTable()
  documents: FileEntity[];

  @AutoMap()
  @Column({ nullable: false })
  title: string;

  @AutoMap()
  @Column('text', { nullable: false })
  content: string;

  @AutoMap(() => CompanyEntity)
  @ManyToOne(() => CompanyEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  company: CompanyEntity;

  @AutoMap(() => UserTenantEntity)
  @ManyToOne(() => UserTenantEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  creator: UserTenantEntity;

  @AutoMap(() => TenderCategoryEntity)
  @ManyToOne(() => TenderCategoryEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  category: TenderCategoryEntity;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => [CompanyParticipationCompanyTenderEntity])
  @OneToMany(
    () => CompanyParticipationCompanyTenderEntity,
    (userTender) => userTender.tender,
    { nullable: true },
  )
  participants: CompanyParticipationCompanyTenderEntity[];
}
