import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { UserTenderEntity } from '../entities/user-tender.entity';

export const userTenderPaginationConfig: PaginateConfig<UserTenderEntity> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['documents', 'creator', 'creator.photo', 'category'],
  searchableColumns: ['title', 'content'],
  sortableColumns: ['createdAt', 'updatedAt', 'title'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    title: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    'category.id': [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
  },
};
