import EntityHelper from '../../utils/entities/entity-helper';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from 'automapper-classes';
import { NotificationTypeOfSendingEnum } from '@/enums/notification-type-of-sending.enum';

@Entity()
export class Notification extends EntityHelper {
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
    enum: NotificationTypeOfSendingEnum,
    default: NotificationTypeOfSendingEnum.IMMEDIATELY,
  })
  typeOfSending: NotificationTypeOfSendingEnum;

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
    if (this.typeOfSending !== NotificationTypeOfSendingEnum.PROGRAMMED) {
      this.scheduledNotification = null;
    }
    if (this.typeOfSending !== NotificationTypeOfSendingEnum.PUNCTUAL) {
      this.punctualSendDate = null;
    }
    if (this.typeOfSending === NotificationTypeOfSendingEnum.IMMEDIATELY) {
      this.scheduledNotification = null;
      this.punctualSendDate = null;
    }
  }
}
