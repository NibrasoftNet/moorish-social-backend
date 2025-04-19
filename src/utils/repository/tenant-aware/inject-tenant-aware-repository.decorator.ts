import { Inject } from '@nestjs/common';
import { EntityTarget, ObjectLiteral } from 'typeorm';

export const InjectTenantAwareRepository = <T extends ObjectLiteral>(
  entity: EntityTarget<T>,
) => Inject(`TenantAwareRepository_${entity as string}`);
