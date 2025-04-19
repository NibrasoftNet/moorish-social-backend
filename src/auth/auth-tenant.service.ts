import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { MailService } from '../mail/mail.service';
import { NullableType } from '../utils/types/nullable.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { OtpService } from 'src/otp/otp.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Status } from '../statuses/entities/status.entity';
import { StatusCodeEnum } from '@/enums/statuses.enum';
import { ConfirmOtpEmailDto } from '@/domains/otp/confirm-otp-email.dto';
import { AuthResetPasswordDto } from '@/domains/auth/auth-reset-password.dto';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';
import { AuthNewPasswordDto } from '@/domains/auth/auth-new-password.dto';
import { SharedService } from '../shared-module/shared.service';
import { UsersTenantService } from '../users-tenant/users-tenant.service';
import { UserTenantEntity } from '../users-tenant/entities/user-tenant.entity';
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';
import { SessionAdminResponseDto } from '@/domains/session/session-admin-response.dto';
import { AuthAdminEmailLoginDto } from '@/domains/auth-admin/auth-admin-email-login.dto';
import { CreateUserTenantDto } from '@/domains/user-tenant/create-user-tenant.dto';

@Injectable()
export class AuthTenantService {
  constructor(
    private usersTenantService: UsersTenantService,
    private mailService: MailService,
    private otpService: OtpService,
    private sharedService: SharedService,
    @InjectMapper() private mapper: Mapper,
    private readonly i18n: I18nService,
  ) {}

  async register(authEmailRegisterDto: CreateUserTenantDto): Promise<boolean> {
    // Attempt to restore a soft-deleted user by email
    const restoredUser = await this.usersTenantService.restoreUserByEmail(
      authEmailRegisterDto.email,
    );
    const newUser = new CreateUserTenantDto();
    newUser.email = authEmailRegisterDto.email;
    newUser.firstName = authEmailRegisterDto.firstName;
    newUser.lastName = authEmailRegisterDto.lastName;
    newUser.password = authEmailRegisterDto.password;

    const user = restoredUser
      ? restoredUser
      : await this.usersTenantService.create(newUser);
    await this.sendConfirmEmail(user.email);
    return true;
  }

  async validateLogin(
    loginDto: AuthAdminEmailLoginDto,
  ): Promise<SessionAdminResponseDto> {
    const user = await this.usersTenantService.findOneOrFail({
      email: loginDto.email,
    });

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: {
            password: this.i18n.t('auth.invalidPassword', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.status?.id === StatusCodeEnum.INACTIVE) {
      await this.sendConfirmEmail(user.email);
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            email: this.i18n.t('auth.emailNotConfirmed', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    if (loginDto.notificationsToken) {
      await this.usersTenantService.update(user.id, {
        notificationsToken: loginDto.notificationsToken,
      });
    }

    const { accessToken, refreshToken, tokenExpires } =
      await this.sharedService.getTokensData({
        id: user.id,
        role: user.role,
      });

    return new SessionAdminResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserTenantEntity, UserTenantDto),
    });
  }

  async confirmEmail(confirmOtpEmailDto: ConfirmOtpEmailDto): Promise<void> {
    await this.otpService.verifyOtp(confirmOtpEmailDto);
    const user = await this.usersTenantService.findOne({
      email: confirmOtpEmailDto.email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            user: this.i18n.t('auth.userNotFound', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.status = plainToClass(Status, {
      id: StatusCodeEnum.ACTIVE,
      code: StatusCodeEnum.ACTIVE,
    });
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersTenantService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            email: this.i18n.t('auth.emailNotExists', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    await this.sendForgetPasswordEmail(email);
  }

  async resetPassword(resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    const user = await this.usersTenantService.findOneOrFail({
      email: resetPasswordDto.email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            email: this.i18n.t('auth.emailNotExists', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    await this.otpService.validateVerification(resetPasswordDto.email);
    user.password = resetPasswordDto.password;
    await user.save();
  }

  async me(userJwtPayload: JwtPayloadType): Promise<SessionAdminResponseDto> {
    const user = await this.usersTenantService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const { accessToken, refreshToken, tokenExpires } =
      await this.sharedService.getTokensData({
        id: user.id,
        role: user.role,
      });
    return new SessionAdminResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserTenantEntity, UserTenantDto),
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    updateUserDto: AuthUpdateDto,
    files?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<NullableType<UserTenantEntity>> {
    return await this.usersTenantService.update(
      userJwtPayload.id,
      updateUserDto,
      files,
    );
  }

  async newPassword(
    userJwtPayload: JwtPayloadType,
    newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    const user = await this.usersTenantService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const isValidPassword = await bcrypt.compare(
      newPasswordDto.oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: {
            password: this.i18n.t('auth.invalidPassword', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.usersTenantService.update(userJwtPayload.id, {
      password: newPasswordDto.newPassword,
    });
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'id'>,
  ): Promise<SessionAdminResponseDto> {
    const user = await this.usersTenantService.findOneOrFail({
      id: data.id,
    });

    const { accessToken, refreshToken, tokenExpires } =
      await this.sharedService.getTokensData({
        id: user.id,
        role: user.role,
      });

    return new SessionAdminResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserTenantEntity, UserTenantDto),
    });
  }

  async softDelete(user: UserTenantEntity): Promise<void> {
    await this.usersTenantService.softDelete(user.id);
  }

  adminLogout(data: Pick<JwtRefreshPayloadType, 'id'>) {
    return data;
  }

  async sendConfirmEmail(email: string) {
    // OTP Generation
    const otp = await this.otpService.createOtp({ email });
    await this.mailService.userSignUp({
      to: email,
      data: {
        otp,
      },
    });
  }

  async sendForgetPasswordEmail(email: string) {
    // OTP Generation
    const otp = await this.otpService.createOtp({ email });
    await this.mailService.forgotPassword({
      to: email,
      data: {
        otp,
      },
    });
  }
}
