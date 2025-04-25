import { AutoMap } from 'automapper-classes';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './notification.entity';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity()
export class NotificationRecipient extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Notification)
  @ManyToOne(() => Notification, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  notification: Notification;

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
