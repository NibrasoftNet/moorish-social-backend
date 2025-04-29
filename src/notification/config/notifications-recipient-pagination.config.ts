import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';

import { NotificationRecipientEntity } from '../entities/notification-recipient.entity';

export const notificationsRecipientPaginationConfig: PaginateConfig<NotificationRecipientEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['receivers', 'notification'],
    searchableColumns: ['isRead'],
    sortableColumns: ['createdAt', 'updatedAt', 'isRead'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      isRead: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
