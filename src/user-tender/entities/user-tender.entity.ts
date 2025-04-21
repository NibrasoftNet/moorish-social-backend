import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { UserEntity } from '../../users/entities/user.entity';
import { TenderCategoryEntity } from '../../tender-category/entities/tender-category.entity';

@Entity()
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

  @AutoMap(() => TenderCategoryEntity)
  @ManyToOne(() => TenderCategoryEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  category: TenderCategoryEntity;
}
