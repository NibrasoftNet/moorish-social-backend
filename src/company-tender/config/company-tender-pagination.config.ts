import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyTenderEntity } from '../entities/company-tender.entity';

export const companyTenderPaginationConfig: PaginateConfig<CompanyTenderEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['documents', 'creator', 'creator.image', 'company', 'category'],
    searchableColumns: ['title', 'content'],
    sortableColumns: ['createdAt', 'updatedAt', 'title'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      title: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
      'category.id': [FilterOperator.EQ, FilterSuffix.NOT],
      'company.id': [FilterOperator.EQ, FilterSuffix.NOT],
      active: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
