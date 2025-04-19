import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { TokenCategoryEntity } from '../entities/token-category.entity';

export const tokenCategoryPaginationConfig: PaginateConfig<TokenCategoryEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: [],
    searchableColumns: ['name'],
    sortableColumns: ['createdAt', 'updatedAt', 'name'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      name: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
