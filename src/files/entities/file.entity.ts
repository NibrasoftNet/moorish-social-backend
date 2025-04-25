import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Allow } from 'class-validator';
import EntityHelper from '../../utils/entities/entity-helper';
import appConfig from '../../config/app.config';
import { AppConfig } from 'src/config/app-config.type';
import { AutoMap } from 'automapper-classes';

@Entity({ name: 'file' })
export class FileEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @AutoMap()
  @Allow()
  @Column()
  path: string;

  @AutoMap()
  @Column()
  mimeType: string;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = (appConfig() as AppConfig).backendDomain + this.path;
    }
  }
}
