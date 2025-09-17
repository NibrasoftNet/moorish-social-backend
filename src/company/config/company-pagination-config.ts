import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyEntity } from '../entities/company.entity';

export const companyPaginationConfig: PaginateConfig<CompanyEntity> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['tenants', 'image', 'address', 'categories'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
