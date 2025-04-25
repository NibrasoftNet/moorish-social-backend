import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyParticipationUserTenderEntity } from '../entities/company-participation-user-tender.entity';

export const companyParticipationUserTenderPaginationConfig: PaginateConfig<CompanyParticipationUserTenderEntity> =
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
