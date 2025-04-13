import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [UsersModule],
  controllers: [OauthController],
  providers: [OauthService, GoogleStrategy],
})
export class OauthModule {}
