import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { UserRequestOfferEntity } from '../entities/user-request-offer.entity';

export const userRequestOfferPaginationConfig: PaginateConfig<UserRequestOfferEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['offer', 'creator', 'answerer'],
    searchableColumns: ['request'],
    sortableColumns: ['createdAt', 'updatedAt', 'request'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      'offer.id': [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
