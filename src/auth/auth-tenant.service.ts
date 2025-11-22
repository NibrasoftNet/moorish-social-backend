import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { MailService } from '../mail/mail.service';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { OtpService } from 'src/otp/otp.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Status } from '../statuses/entities/status.entity';
import { StatusCodeEnum } from '@/enums/statuses.enum';
import { ConfirmOtpEmailDto } from '../otp/dto/confirm-otp-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthNewPasswordDto } from './dto/auth-new-password.dto';
import { SharedService } from '../shared-module/shared.service';
import { UsersTenantService } from '../users-tenant/users-tenant.service';
import { UserTenantEntity } from '../users-tenant/entities/user-tenant.entity';
import { UserTenantDto } from '../users-tenant/dto/user-tenant.dto';
import { SessionAdminResponseDto } from '../session/dto/session-admin-response.dto';
import { AuthAdminEmailLoginDto } from './dto-admin/auth-admin-email-login.dto';
import { CreateUserTenantDto } from '../users-tenant/dto/create-user-tenant.dto';
import { SessionService } from '../session/session.service';
import { AuthTenantUpdateDto } from './dto/tenant/auth-tenant-update.dto';

@Injectable()
export class AuthTenantService {
  constructor(
    private usersTenantService: UsersTenantService,
    private mailService: MailService,
    private otpService: OtpService,
    private sessionService: SessionService,
    private sharedService: SharedService,
    @InjectMapper() private mapper: Mapper,
    private readonly i18n: I18nService,
  ) {}

  async register(authEmailRegisterDto: CreateUserTenantDto): Promise<string> {
    // Attempt to restore a soft-deleted user by email
    const restoredUser = await this.usersTenantService.restoreUserByEmail(
      authEmailRegisterDto.email,
    );
    const newUser = new CreateUserTenantDto();
    newUser.email = authEmailRegisterDto.email;
    newUser.firstName = authEmailRegisterDto.firstName;
    newUser.lastName = authEmailRegisterDto.lastName;
    newUser.password = authEmailRegisterDto.password;
    newUser.position = authEmailRegisterDto.position;

    const user = restoredUser
      ? restoredUser
      : await this.usersTenantService.create(newUser);
    await this.sendConfirmEmail(user.email);
    return user.email;
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

    // Create or Update session
    await this.sessionService.update(user.id, {
      userId: user.id,
      refreshToken: refreshToken,
    });
    return plainToInstance(SessionAdminResponseDto, {
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

  async forgotPassword(email: string): Promise<string> {
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
    return email;
  }

  async resetPassword(
    resetPasswordDto: AuthResetPasswordDto,
  ): Promise<boolean> {
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
    return true;
  }

  async me(userJwtPayload: JwtPayloadType): Promise<SessionAdminResponseDto> {
    const user = await this.usersTenantService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const { accessToken, tokenExpires } =
      await this.sharedService.getAccessTokensData({
        id: user.id,
        role: user.role,
      });
    // Verify session
    const session = await this.sessionService.findOneOrFail({
      userId: user.id,
    });
    return plainToInstance(SessionAdminResponseDto, {
      accessToken,
      refreshToken: session.refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserTenantEntity, UserTenantDto),
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    updateUserDto: AuthTenantUpdateDto,
    files?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<UserTenantEntity> {
    return await this.usersTenantService.update(
      userJwtPayload.id,
      updateUserDto,
      files,
    );
  }

  async newPassword(
    userJwtPayload: JwtPayloadType,
    newPasswordDto: AuthNewPasswordDto,
  ): Promise<UserTenantEntity> {
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
    console.log('wsxx', user);
    user.password = newPasswordDto.newPassword;
    return await user.save();
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'id'>,
  ): Promise<SessionAdminResponseDto> {
    const user = await this.usersTenantService.findOneOrFail({
      id: data.id,
    });

    const { accessToken, tokenExpires } =
      await this.sharedService.getAccessTokensData({
        id: user.id,
        role: user.role,
      });
    // Verify session
    const session = await this.sessionService.findOneOrFail({
      userId: user.id,
    });
    return plainToInstance(SessionAdminResponseDto, {
      accessToken,
      refreshToken: session.refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserTenantEntity, UserTenantDto),
    });
  }

  async softDelete(user: UserTenantEntity): Promise<void> {
    await this.usersTenantService.softDelete(user.id);
  }

  async adminLogout(data: Pick<JwtRefreshPayloadType, 'id'>) {
    await this.sessionService.remove(data.id);
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
