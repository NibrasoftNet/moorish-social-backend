import { Module, DynamicModule } from '@nestjs/common';
import { createTenantAwareRepositoryProvider } from './tenant-aware.provider';
import { EntityTarget, ObjectLiteral } from 'typeorm';

@Module({})
export class TenantAwareRepositoryModule {
  static forEntities<T extends ObjectLiteral>(
    entities: EntityTarget<T>[],
  ): DynamicModule {
    const providers = entities.map((entity) =>
      createTenantAwareRepositoryProvider(entity),
    );

    return {
      module: TenantAwareRepositoryModule,
      providers: providers,
      exports: providers,
    };
  }
}
