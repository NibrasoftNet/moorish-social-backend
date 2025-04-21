import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { CompanyEntity } from '../../company/entities/company.entity';
import { languageEnum } from '@/enums/language.enum';

@Entity()
export class CompanyCategoryEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => FileEntity)
  @OneToOne(() => FileEntity, (file) => file, {
    eager: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  image: FileEntity;

  @AutoMap()
  @Column({ nullable: false })
  title: string;

  @AutoMap(() => CompanyCategoryEntity)
  @ManyToOne(() => CompanyCategoryEntity, (category) => category.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent?: CompanyCategoryEntity | null;

  @AutoMap(() => [CompanyCategoryEntity])
  @OneToMany(() => CompanyCategoryEntity, (category) => category.parent)
  children: CompanyCategoryEntity[];

  @AutoMap(() => [CompanyEntity])
  @OneToMany(() => CompanyEntity, (company) => company.category)
  companies: CompanyEntity[];

  @AutoMap()
  @Column({ default: languageEnum['en-US'] })
  language: languageEnum;
}
