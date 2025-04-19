import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyCategoryEntity } from '../entities/company-category.entity';

export const companyCategoryPaginationConfig: PaginateConfig<CompanyCategoryEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: [
      'parent',
      'image',
      'children',
      'children.image',
      'parent.image',
    ],
    searchableColumns: ['title', 'parent.id'],
    sortableColumns: ['createdAt', 'updatedAt', 'title'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      title: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
