import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './notification.entity';
import { UserEntity } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';

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

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @AutoMap()
  @Column({ default: false })
  isRead: boolean;

  @AutoMap()
  @Column({ type: Date, nullable: true })
  readAt: Date | null;
}
