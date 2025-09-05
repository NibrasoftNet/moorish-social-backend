import { AutoMap } from 'automapper-classes';
import { Expose } from 'class-transformer';
import { NotificationEnum } from '@/enums/notification.enum';

export class NotificationDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  title: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  message: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  forAllUsers: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  typeOfSending: NotificationEnum;

  @AutoMap(() => Date)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  punctualSendDate?: Date;

  @AutoMap(() => [Date])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  scheduledNotification: Date[] | null;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;

  @AutoMap(() => Object)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  receivers: Array<{
    id: string;
    name: string;
    notificationToken: string;
  }>;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  isNotificationSent: boolean;
}
