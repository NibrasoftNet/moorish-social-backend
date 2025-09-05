import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { ChatEntity } from '../entities/chat.entity';

export const chatPaginationConfig: PaginateConfig<ChatEntity> = {
  defaultSortBy: [['updatedAt', 'DESC']],
  relations: ['creator', 'participants', 'sender', 'receiver'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
