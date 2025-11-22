import { Module } from '@nestjs/common';
import { CompanySubscriptionTokenService } from './company-subscription-token.service';
import { CompanySubscriptionTokenController } from './company-subscription-token.controller';
import { CompanySubscriptionTokenSerializationProfile } from './serialization/company-subscription-token-serialization.profile';
import { CompanySubscriptionTokenEntity } from './entities/company-subscription-token.entity';
import { CategoryTokenModule } from '../category-token/category-token.module';
import { CompanyModule } from '../company/company.module';
import { TenantAwareRepositoryModule } from '../utils/repository/tenant-aware';

@Module({
  imports: [
    TenantAwareRepositoryModule.forEntities([CompanySubscriptionTokenEntity]),
    CompanyModule,
    CategoryTokenModule,
  ],
  controllers: [CompanySubscriptionTokenController],
  providers: [
    CompanySubscriptionTokenService,
    CompanySubscriptionTokenSerializationProfile,
  ],
})
export class CompanySubscriptionTokenModule {}
