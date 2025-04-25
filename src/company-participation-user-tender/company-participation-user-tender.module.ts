import { Module } from '@nestjs/common';
import { CompanyParticipationUserTenderService } from './company-participation-user-tender.service';
import { CompanyParticipationUserTenderController } from './company-participation-user-tender.controller';
import { CompanyParticipationUserTenderEntity } from './entities/company-participation-user-tender.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTenderModule } from '../user-tender/user-tender.module';
import { FilesModule } from '../files/files.module';
import { CompanyModule } from '../company/company.module';
import { CompanyOfferUserTenderSerializationProfile } from './serialization/company-offer-user-tender-serialization.profile';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyParticipationUserTenderEntity]),
    UserTenderModule,
    UsersTenantModule,
    CompanyModule,
    FilesModule,
    NotificationModule,
  ],
  controllers: [CompanyParticipationUserTenderController],
  providers: [
    CompanyParticipationUserTenderService,
    CompanyOfferUserTenderSerializationProfile,
  ],
})
export class CompanyParticipationUserTenderModule {}
