import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { UserTestimonialEntity } from '../entities/user-testimonial.entity';

export const userTestimonialPaginationConfig: PaginateConfig<UserTestimonialEntity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['user', 'user.photo'],
    searchableColumns: ['rate'],
    sortableColumns: ['createdAt', 'updatedAt'],
    defaultLimit: 20,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      createdAt: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
