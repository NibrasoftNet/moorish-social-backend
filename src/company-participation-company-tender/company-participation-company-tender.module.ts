import { Module } from '@nestjs/common';
import { CompanyParticipationCompanyTenderService } from './company-participation-company-tender.service';
import { CompanyParticipationCompanyTenderController } from './company-participation-company-tender.controller';
import { CompanyParticipationCompanyTenderEntity } from './entities/company-participation-company-tender.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../files/files.module';
import { CompanyModule } from '../company/company.module';
import { CompanyParticipationCompanyTenderSerializationProfile } from './serialization/company-participation-company-tender-serialization.profile';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { NotificationModule } from '../notification/notification.module';
import { CompanyTenderModule } from '../company-tender/company-tender.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyParticipationCompanyTenderEntity]),
    CompanyTenderModule,
    UsersTenantModule,
    CompanyModule,
    FilesModule,
    NotificationModule,
  ],
  controllers: [CompanyParticipationCompanyTenderController],
  providers: [
    CompanyParticipationCompanyTenderService,
    CompanyParticipationCompanyTenderSerializationProfile,
  ],
})
export class CompanyParticipationCompanyTenderModule {}
