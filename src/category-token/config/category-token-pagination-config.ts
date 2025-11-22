import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CategoryTokenEntity } from '../entities/category-token.entity';

export const categoryTokenPaginationConfig: PaginateConfig<CategoryTokenEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: [],
    searchableColumns: ['value'],
    sortableColumns: ['createdAt', 'updatedAt', 'value'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      name: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
