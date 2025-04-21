import { Module } from '@nestjs/common';
import { UserRequestOfferService } from './user-request-offer.service';
import { UserRequestOfferController } from './user-request-offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRequestOfferEntity } from './entities/user-request-offer.entity';
import { UsersModule } from '../users/users.module';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { CompanyOfferModule } from '../company-offer/company-offer.module';
import { UserRequestOfferSerializationProfile } from './serialization/user-request-offer-serialization.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRequestOfferEntity]),
    UsersModule,
    UsersTenantModule,
    CompanyOfferModule,
  ],
  controllers: [UserRequestOfferController],
  providers: [UserRequestOfferService, UserRequestOfferSerializationProfile],
})
export class UserRequestOfferModule {}
