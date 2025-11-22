import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CategoryCompanyEntity } from '../entities/category-company.entity';

export const categoryCompanyPaginationConfig: PaginateConfig<CategoryCompanyEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['parent', 'children'],
    searchableColumns: ['value', 'parent.id'],
    sortableColumns: ['createdAt', 'updatedAt', 'value'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      value: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
