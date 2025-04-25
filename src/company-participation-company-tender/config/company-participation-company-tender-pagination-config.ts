import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyParticipationCompanyTenderEntity } from '../entities/company-participation-company-tender.entity';

export const companyParticipationCompanyTenderPaginationConfig: PaginateConfig<CompanyParticipationCompanyTenderEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['documents', 'company', 'tender'],
    searchableColumns: ['title'],
    sortableColumns: ['createdAt', 'updatedAt', 'title'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      title: [FilterOperator.EQ, FilterSuffix.NOT],
      status: [FilterOperator.EQ, FilterSuffix.NOT],
      'tender.id': [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
