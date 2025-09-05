import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { FilesModule } from '../files/files.module';
import { OtpModule } from 'src/otp/otp.module';
import { AuthTenantService } from './auth-tenant.service';
import { UsersTenantModule } from '../users-tenant/users-tenant.module';
import { AuthTenantController } from './auth-tenant.controller';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    UsersModule,
    UsersTenantModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
    FilesModule,
    OtpModule,
    SessionModule,
  ],
  controllers: [AuthController, AuthTenantController],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    AuthTenantService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
  ],
  exports: [AuthService, AuthTenantService],
})
export class AuthModule {}
