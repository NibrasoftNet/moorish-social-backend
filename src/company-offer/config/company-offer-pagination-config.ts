import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyOfferEntity } from '../entities/company-offer.entity';

export const companyOfferPaginationConfig: PaginateConfig<CompanyOfferEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['company', 'creator', 'images', 'category'],
    searchableColumns: ['title'],
    sortableColumns: ['createdAt', 'updatedAt', 'title'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      title: [FilterOperator.EQ, FilterSuffix.NOT],
      'category.id': [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
