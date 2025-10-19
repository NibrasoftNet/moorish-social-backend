import EntityHelper from '../../utils/entities/entity-helper';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { NotificationEnum } from '@/enums/notification.enum';

@Entity({ name: 'notification' })
export class NotificationEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => String)
  @Column({ nullable: false, length: 64 })
  title: string;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  message: string | null;

  @AutoMap()
  @Column()
  forAllUsers: boolean;

  @AutoMap()
  @Column({
    enum: NotificationEnum,
    default: NotificationEnum.IMMEDIATELY,
  })
  typeOfSending: NotificationEnum;

  @AutoMap(() => Date)
  @Column({ type: Date, nullable: true })
  punctualSendDate: Date | null;

  @AutoMap(() => [Date])
  @Column({ type: Date, nullable: true, array: true })
  scheduledNotification: Date[] | null;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => Object)
  @Column({ type: 'jsonb', nullable: true })
  receivers: Array<{
    id: string;
    name: string;
    notificationToken: string;
  }>;

  @AutoMap(() => Boolean)
  @Column({ default: false })
  isNotificationSent: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  handleTypeOfSending() {
    if (this.typeOfSending !== NotificationEnum.PROGRAMMED) {
      this.scheduledNotification = null;
    }
    if (this.typeOfSending !== NotificationEnum.PUNCTUAL) {
      this.punctualSendDate = null;
    }
    if (this.typeOfSending === NotificationEnum.IMMEDIATELY) {
      this.scheduledNotification = null;
      this.punctualSendDate = null;
    }
  }
}
