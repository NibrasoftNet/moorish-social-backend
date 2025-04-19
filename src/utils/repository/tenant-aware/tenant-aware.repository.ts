import {
  DataSource,
  DeepPartial,
  DeleteResult,
  EntityTarget,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
} from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { NullableType } from '../../types/nullable.type';

export class TenantAwareRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  constructor(
    entity: EntityTarget<T>,
    dataSource: DataSource,
    private readonly cls: ClsService,
  ) {
    super(entity, dataSource.createEntityManager());
  }

  private getTenantId(): string {
    const tenantId = this.cls.get('tenantId');
    if (!tenantId) {
      throw new HttpException(
        {
          status: HttpStatus.EXPECTATION_FAILED,
          errors: {
            tenant: 'Tenant-Id header is missing',
          },
        },
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return tenantId;
  }

  // Override find method to include tenantId
  async findTenantContext(options?: FindManyOptions<T>): Promise<T[]> {
    const tenantId = this.getTenantId();

    // Destructure `where` from options
    const { where, ...rest } = options || {};

    // Type-safe merging of `tenantId` into the `where` clause
    const tenantAwareWhere = where
      ? { ...where, tenantId }
      : ({ tenantId } as unknown as FindOptionsWhere<T>);

    // Call the original find method with modified options
    return super.find({ ...rest, where: tenantAwareWhere });
  }

  // Override findOne method to include tenantId
  async findOneTenantContext(
    fields: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T>,
  ): Promise<NullableType<T>> {
    const tenantId = this.getTenantId();
    fields = { ...fields, tenantId } as FindOptionsWhere<T>;
    return super.findOne({ where: fields, relations, select });
  }

  // Override findOne method to include tenantId
  async findOneOrFailTenantContext(
    fields: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    select?: FindOptionsSelect<T>,
  ): Promise<T> {
    const tenantId = this.getTenantId();
    fields = { ...fields, tenantId } as FindOptionsWhere<T>;
    return super.findOneOrFail({ where: fields, relations, select });
  }

  // Override create method to include tenantId
  createTenantContext(entity?: DeepPartial<T>): T {
    const tenantId = this.getTenantId();

    // Add tenantId to the entity
    const entityWithTenant = { ...entity, tenantId } as T;

    // Call the original save method
    return super.create(entityWithTenant);
  }

  // Override save method to include tenantId
  async saveTenantContext(
    entity: DeepPartial<T>,
    options?: SaveOptions,
  ): Promise<T> {
    const tenantId = this.getTenantId();

    // Add tenantId to the entity
    const entityWithTenant = { ...entity, tenantId } as T;

    // Call the original save method
    return super.save<T>(entityWithTenant, options);
  }

  // Override delete method to ensure tenant isolation
  async softDeleteTenantContext(
    criteria: FindOptionsWhere<T>,
  ): Promise<DeleteResult> {
    const tenantId = this.getTenantId();
    criteria = { ...criteria, tenantId } as FindOptionsWhere<T>;
    return await super.softDelete(criteria);
  }

  // Override count method to ensure tenant isolation
  async getTotalTenantContext(where?: FindOptionsWhere<T>): Promise<number> {
    const tenantId = this.getTenantId();

    // Add tenantId to where clause if provided
    const tenantAwareWhere = where
      ? { ...where, tenantId }
      : ({ tenantId } as unknown as FindOptionsWhere<T>);

    return super.count({ where: tenantAwareWhere });
  }

  // Method to create a tenant-aware query builder
  createTenantContextQueryBuilder(alias: string): SelectQueryBuilder<T> {
    const tenantId = this.getTenantId();

    return super
      .createQueryBuilder(alias)
      .andWhere(`${alias}.tenantId = :tenantId`, {
        tenantId,
      });
  }

  async paginateTenantContext<T extends ObjectLiteral>(
    query: PaginateQuery,
    tenantAwareRepository: Repository<T>,
    paginationConfig: PaginateConfig<T>,
  ): Promise<Paginated<T>> {
    const tenantId = this.getTenantId();

    // Merge tenantId into the where clause
    const tenantAwareWhere = { tenantId } as unknown as FindOptionsWhere<T>;

    return paginate(query, tenantAwareRepository, {
      ...paginationConfig,
      where: tenantAwareWhere,
    });
  }
}
