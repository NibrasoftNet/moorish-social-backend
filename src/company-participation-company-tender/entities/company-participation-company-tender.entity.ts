import { AutoMap } from 'automapper-classes';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { CompanyEntity } from '../../company/entities/company.entity';
import { RequestStatusEnum } from '@/enums/request-status.enum';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';
import { CompanyTenderEntity } from '../../company-tender/entities/company-tender.entity';

@Entity()
export class CompanyParticipationCompanyTenderEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => [FileEntity])
  @ManyToMany(() => FileEntity, { eager: true })
  @JoinTable()
  documents: FileEntity[];

  @AutoMap()
  @Column('text', { nullable: false })
  title: string;

  @AutoMap()
  @Column('text', { nullable: false })
  content: string;

  @AutoMap()
  @Column({ default: RequestStatusEnum.PENDING })
  status: RequestStatusEnum;

  @AutoMap(() => CompanyTenderEntity)
  @ManyToOne(() => CompanyTenderEntity, (tender) => tender.participants, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  tender: CompanyTenderEntity;

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
  })
  creator: UserTenantEntity;
}
