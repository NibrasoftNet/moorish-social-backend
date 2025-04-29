import { AutoMap } from 'automapper-classes';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity()
export class NotificationRecipientEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => NotificationEntity)
  @ManyToOne(() => NotificationEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  notification: NotificationEntity;

  @AutoMap(() => Object)
  @Column({ type: 'jsonb', nullable: true })
  receivers: {
    id: string;
    name: string;
    notificationToken: string;
  };

  @AutoMap()
  @Column({ default: false })
  isRead: boolean;

  @AutoMap()
  @Column({ type: Date, nullable: true })
  readAt: Date | null;
}
