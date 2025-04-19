import { Provider } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { TenantAwareRepository } from './tenant-aware.repository';
import { ClsService } from 'nestjs-cls';

type TenantAwareRepositoryProvider<T extends ObjectLiteral> = Provider & {
  provide: string; // Explicitly define the `provide` property
  useFactory: (
    dataSource: DataSource,
    clsService: ClsService,
  ) => TenantAwareRepository<T>;
  inject: [typeof DataSource, typeof ClsService];
};

export function createTenantAwareRepositoryProvider<T extends ObjectLiteral>(
  entity: EntityTarget<T>,
): TenantAwareRepositoryProvider<T> {
  return {
    provide: `TenantAwareRepository_${entity as string}`,
    useFactory: (dataSource: DataSource, clsService: ClsService) =>
      new TenantAwareRepository<T>(entity, dataSource, clsService),
    inject: [DataSource, ClsService],
  };
}
