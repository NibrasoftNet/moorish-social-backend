import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { SubscriptionTokenEntity } from '../entities/subscription-token.entity';

export const subscriptionTokenPaginationConfig: PaginateConfig<SubscriptionTokenEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['company', 'category'],
    searchableColumns: ['company.name'],
    sortableColumns: ['createdAt', 'updatedAt'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      'company.name': [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
