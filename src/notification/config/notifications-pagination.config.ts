import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';

import { NotificationEntity } from '../entities/notification.entity';

export const notificationsPaginationConfig: PaginateConfig<NotificationEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['receivers'],
    searchableColumns: ['title', 'message', 'typeOfSending'],
    sortableColumns: ['createdAt', 'updatedAt', 'active', 'typeOfSending'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      title: [FilterOperator.EQ, FilterSuffix.NOT],
      message: [FilterOperator.EQ, FilterSuffix.NOT],
      forAllUsers: [FilterOperator.EQ, FilterSuffix.NOT],
      active: [FilterOperator.EQ, FilterSuffix.NOT],
      typeOfSending: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
