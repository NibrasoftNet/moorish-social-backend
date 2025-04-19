import { Module } from '@nestjs/common';
import { SubscriptionTokenService } from './subscription-token.service';
import { SubscriptionTokenController } from './subscription-token.controller';
import { SubscriptionTokenSerializationProfile } from './serialization/subscription-token-serialization.profile';
import { SubscriptionTokenEntity } from './entities/subscription-token.entity';
import { TokenCategoryModule } from '../token-category/token-category.module';
import { CompanyModule } from '../company/company.module';
import { TenantAwareRepositoryModule } from '../utils/repository/tenant-aware/tenant-aware.module';

@Module({
  imports: [
    TenantAwareRepositoryModule.forEntities([SubscriptionTokenEntity]),
    CompanyModule,
    TokenCategoryModule,
  ],
  controllers: [SubscriptionTokenController],
  providers: [SubscriptionTokenService, SubscriptionTokenSerializationProfile],
})
export class SubscriptionTokenModule {}
