import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CompanyPostEntity } from '../entities/company-post.entity';

export const companyPostPaginationConfig: PaginateConfig<CompanyPostEntity> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['company', 'creator', 'creator.image', 'images', 'category'],
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
