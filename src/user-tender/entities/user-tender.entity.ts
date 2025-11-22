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
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryTenderEntity } from '../../category-tender/entities/category-tender.entity';
import { CompanyParticipationUserTenderEntity } from '../../company-participation-user-tender/entities/company-participation-user-tender.entity';

@Entity({ name: 'user_tender' })
export class UserTenderEntity extends EntityHelper {
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

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  creator: UserEntity;

  @AutoMap(() => CategoryTenderEntity)
  @ManyToOne(() => CategoryTenderEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  category: CategoryTenderEntity;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => [CompanyParticipationUserTenderEntity])
  @OneToMany(
    () => CompanyParticipationUserTenderEntity,
    (userTender) => userTender.tender,
    { nullable: true },
  )
  participants: CompanyParticipationUserTenderEntity[];
}
