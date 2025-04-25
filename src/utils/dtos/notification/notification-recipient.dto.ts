import { AutoMap } from 'automapper-classes';
import { NotificationDto } from '@/domains/notification/notification.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class NotificationRecipientDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => NotificationDto)
  notification: NotificationDto;

  @AutoMap(() => Object)
  receivers: {
    id: string;
    name: string;
    notificationToken: string;
  };

  @AutoMap()
  isRead: boolean;

  @AutoMap()
  readAt: Date;
}
