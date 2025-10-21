import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { CreateUserDto } from '../users/user/create-user.dto';
import { AuthNewPasswordDto } from './dto/auth-new-password.dto';
import { AuthTenantService } from './auth-tenant.service';
import { SessionAdminResponseDto } from '../session/dto/session-admin-response.dto';
import { UserTenantEntity } from '../users-tenant/entities/user-tenant.entity';
import { UserTenantDto } from '../users-tenant/dto/user-tenant.dto';
import { AuthAdminEmailLoginDto } from './dto-admin/auth-admin-email-login.dto';
import { AuthAdminForgotPasswordDto } from './dto-admin/auth-admin-forgot-password.dto';
import { AuthRequest } from '../utils/types/auth-request.type';
import { CreateUserTenantDto } from '../users-tenant/dto/create-user-tenant.dto';
import { ConfirmOtpEmailDto } from '../otp/dto/confirm-otp-email.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthTenantUpdateDto } from './dto/tenant/auth-tenant-update.dto';

@ApiTags('Auth tenants')
@Controller({
  path: 'auth-tenants',
  version: '1',
})
export class AuthTenantController {
  constructor(
    private readonly authTenantService: AuthTenantService,
    @InjectMapper()
    private mapper: Mapper,
  ) {}

  @Post('email-login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthAdminEmailLoginDto,
  ): Promise<SessionAdminResponseDto> {
    return await this.authTenantService.validateLogin(loginDto);
  }

  @Post('email-register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserTenantDto): Promise<string> {
    return await this.authTenantService.register(createUserDto);
  }

  @Post('email-confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() confirmOtpEmailDto: ConfirmOtpEmailDto,
  ): Promise<void> {
    return await this.authTenantService.confirmEmail(confirmOtpEmailDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthAdminForgotPasswordDto,
  ): Promise<void> {
    return await this.authTenantService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    return await this.authTenantService.resetPassword(resetPasswordDto);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async me(
    @Request() request: AuthRequest,
  ): Promise<SessionAdminResponseDto> {
    return await this.authTenantService.me(request.user);
  }

  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @Request() request: AuthRequest,
  ): Promise<SessionAdminResponseDto> {
    return await this.authTenantService.refreshToken({
      id: request.user.id,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async adminLogout(@Request() request: AuthRequest): Promise<void> {
    await this.authTenantService.adminLogout({
      id: request.user.id,
    });
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(AuthUpdateDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(CreateUserDto),
        },
      },
    },
  })
  @ApiBearerAuth()
  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(UserTenantEntity, UserTenantDto))
  @UseInterceptors(FileInterceptor('file'))
  public async update(
    @Request() request: AuthRequest,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<UserTenantEntity> {
    const updateUserDto = new AuthTenantUpdateDto(data);
    await Utils.validateDtoOrFail(updateUserDto);
    return await this.authTenantService.update(
      request.user,
      updateUserDto,
      file,
    );
  }

  @ApiBearerAuth()
  @Put('me/new-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Request() request: AuthRequest,
    @Body() newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    return await this.authTenantService.newPassword(
      request.user,
      newPasswordDto,
    );
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() request): Promise<void> {
    return await this.authTenantService.softDelete(request.user);
  }
}
