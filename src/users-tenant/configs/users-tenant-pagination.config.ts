import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { UserTenantEntity } from '../entities/user-tenant.entity';

export const usersTenantPaginationConfig: PaginateConfig<UserTenantEntity> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['address', 'role', 'status', 'image'],
  searchableColumns: ['email', 'role.name', 'status.name'],
  sortableColumns: ['email', 'createdAt', 'updatedAt', 'status'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    email: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    userName: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    createdAt: [
      FilterOperator.EQ,
      FilterSuffix.NOT,
      FilterOperator.GTE,
      FilterOperator.LTE,
      FilterOperator.BTW,
    ],
    'status.name': [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
  },
};
