import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanySubscriptionTokenEntity } from '../entities/company-subscription-token.entity';

export const companySubscriptionTokenPaginationConfig: PaginateConfig<CompanySubscriptionTokenEntity> =
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
