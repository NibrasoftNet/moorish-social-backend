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
import { UserTenderEntity } from '../../user-tender/entities/user-tender.entity';
import { CompanyEntity } from '../../company/entities/company.entity';
import { RequestStatusEnum } from '@/enums/request-status.enum';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';

@Entity({ name: 'company_participation_user_tender' })
export class CompanyParticipationUserTenderEntity extends EntityHelper {
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

  @AutoMap(() => UserTenderEntity)
  @ManyToOne(() => UserTenderEntity, (tenant) => tenant.participants, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  tender: UserTenderEntity;

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
