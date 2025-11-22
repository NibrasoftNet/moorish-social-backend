import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyOfferEntity } from '../entities/company-offer.entity';

export const companyOfferPaginationConfig: PaginateConfig<CompanyOfferEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: [
      'company',
      'company.categories',
      'creator',
      'creator.image',
      'creator.role',
      'creator.status',
      'files',
      'category',
    ],
    searchableColumns: ['title'],
    sortableColumns: ['createdAt', 'updatedAt', 'title'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      title: [FilterOperator.EQ, FilterSuffix.NOT],
      'category.id': [FilterOperator.EQ, FilterSuffix.NOT],
      'company.id': [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
