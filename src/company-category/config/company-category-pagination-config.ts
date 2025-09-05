import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyCategoryEntity } from '../entities/company-category.entity';

export const companyCategoryPaginationConfig: PaginateConfig<CompanyCategoryEntity> =
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
