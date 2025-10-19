import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { NullableType } from '../utils/types/nullable.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { OtpService } from 'src/otp/otp.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Status } from '../statuses/entities/status.entity';
import { SessionResponseDto } from '../session/dto/session-response.dto';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthProvidersEnum } from '@/enums/auth.enum';
import { StatusCodeEnum } from '@/enums/statuses.enum';
import { UserDto } from '../users/user/user.dto';
import { AuthEmailRegisterDto } from './dto/auth-email-register.dto';
import { CreateUserDto } from '../users/user/create-user.dto';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { RoleDto } from '../roles/dto/role.dto';
import { StatusesDto } from '../statuses/dto/statuses.dto';
import { ConfirmOtpEmailDto } from '../otp/dto/confirm-otp-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthNewPasswordDto } from './dto/auth-new-password.dto';
import { SharedService } from '../shared-module/shared.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    private otpService: OtpService,
    private sessionService: SessionService,
    private sharedService: SharedService,
    @InjectMapper() private mapper: Mapper,
    private readonly i18n: I18nService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
  ): Promise<SessionResponseDto> {
    const user = await this.usersService.findOneOrFail({
      email: loginDto.email,
    });

    if (user.provider !== AuthProvidersEnum.EMAIL) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            email: `${this.i18n.t('auth.loggedWithSocial', { lang: I18nContext.current()?.lang })}:${user.provider}`,
          },
        },
        HttpStatus.PRECONDITION_REQUIRED,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            password: this.i18n.t('auth.invalidPassword', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    if (user.status?.id === StatusCodeEnum.INACTIVE) {
      await this.sendConfirmEmail(user.email);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
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
      await this.usersService.update(user.id, {
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
    return new SessionResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserEntity, UserDto),
    });
  }

  async register(authEmailRegisterDto: AuthEmailRegisterDto): Promise<string> {
    // Attempt to restore a soft-deleted user by email
    const restoredUser = await this.usersService.restoreUserByEmail(
      authEmailRegisterDto.email,
    );

    const newUser = new CreateUserDto({
      email: authEmailRegisterDto.email,
      role: {
        id: RoleCodeEnum.USER,
      } as RoleDto,
      status: {
        id: StatusCodeEnum.INACTIVE,
      } as StatusesDto,
      address: authEmailRegisterDto.address,
      userName: authEmailRegisterDto.userName,
      password: authEmailRegisterDto.password,
      provider: AuthProvidersEnum.EMAIL,
      socialId: null,
    });
    const user = restoredUser
      ? restoredUser
      : await this.usersService.create(newUser);
    await this.sendConfirmEmail(user.email);
    return user.email;
  }

  async confirmEmail(confirmOtpEmailDto: ConfirmOtpEmailDto): Promise<void> {
    await this.otpService.verifyOtp(confirmOtpEmailDto, true);
    const user = await this.usersService.findOne({
      email: confirmOtpEmailDto.email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            user: this.i18n.t('auth.userNotFound', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    user.status = plainToClass(Status, {
      id: StatusCodeEnum.ACTIVE,
      code: StatusCodeEnum.ACTIVE,
    });
    await user.save();
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            user: this.i18n.t('auth.userNotFound', {
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

  async resetPassword(resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    const user = await this.usersService.findOneOrFail({
      email: resetPasswordDto.email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            user: this.i18n.t('auth.userNotFound', {
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

  async me(userJwtPayload: JwtPayloadType): Promise<SessionResponseDto> {
    const user = await this.usersService.findOneOrFail({
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
    return new SessionResponseDto({
      accessToken,
      refreshToken: session.refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserEntity, UserDto),
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    updateUserDto: AuthUpdateDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<NullableType<UserEntity>> {
    return await this.usersService.update(
      userJwtPayload.id,
      updateUserDto,
      file,
    );
  }

  async newPassword(
    userJwtPayload: JwtPayloadType,
    newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const isValidPassword = await bcrypt.compare(
      newPasswordDto.oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          errors: {
            password: this.i18n.t('auth.invalidPassword', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.usersService.update(userJwtPayload.id, {
      password: newPasswordDto.newPassword,
    });
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'id'>,
  ): Promise<SessionResponseDto> {
    const user = await this.usersService.findOneOrFail({
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
    return new SessionResponseDto({
      accessToken,
      refreshToken: session.refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserEntity, UserDto),
    });
  }

  async softDelete(user: JwtPayloadType): Promise<void> {
    await this.usersService.softDelete(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'id'>) {
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
