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
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
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
import { AuthNewPasswordDto } from './dto/auth-new-password.dto';
import { AuthTenantService } from './auth-tenant.service';
import { SessionAdminResponseDto } from '../session/dto/session-admin-response.dto';
import { UserTenantEntity } from '../users-tenant/entities/user-tenant.entity';
import {
  TenantApiResponseDto,
  UserTenantDto,
} from '../users-tenant/dto/user-tenant.dto';
import {
  AuthAdminEmailLoginApiResponseDto,
  AuthAdminEmailLoginDto,
} from './dto-admin/auth-admin-email-login.dto';
import { AuthAdminForgotPasswordDto } from './dto-admin/auth-admin-forgot-password.dto';
import { AuthRequest } from '../utils/types/auth-request.type';
import { CreateUserTenantDto } from '../users-tenant/dto/create-user-tenant.dto';
import { ConfirmOtpEmailDto } from '../otp/dto/confirm-otp-email.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthTenantUpdateDto } from './dto/tenant/auth-tenant-update.dto';
import { ApiStringResponseDto } from '@/domains/api-string-response.dto';
import { ApiBooleanResponseDto } from '@/domains/api-boolean-response.dto';

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

  @ApiOkResponse({
    description: 'Tenant successfully logged in',
    type: AuthAdminEmailLoginApiResponseDto,
  })
  @Post('email-login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthAdminEmailLoginDto,
  ): Promise<SessionAdminResponseDto> {
    return await this.authTenantService.validateLogin(loginDto);
  }

  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: ApiStringResponseDto,
  })
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

  @ApiOkResponse({
    description: 'Reset password with success',
    type: ApiBooleanResponseDto,
  })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthAdminForgotPasswordDto,
  ): Promise<boolean> {
    return await this.authTenantService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOkResponse({
    description: 'Reset password with success',
    type: ApiBooleanResponseDto,
  })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<boolean> {
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
          $ref: getSchemaPath(AuthUpdateDto),
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
    const authTenantUpdateDto = await Utils.validateDtoOrFail(
      AuthTenantUpdateDto,
      data,
    );
    return await this.authTenantService.update(
      request.user,
      authTenantUpdateDto,
      file,
    );
  }

  @ApiOkResponse({
    description: 'Tenant successfully logged in',
    type: TenantApiResponseDto,
  })
  @ApiBearerAuth()
  @Put('me/new-password')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(MapInterceptor(UserTenantEntity, UserTenantDto))
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Request() request: AuthRequest,
    @Body() newPasswordDto: AuthNewPasswordDto,
  ): Promise<UserTenantEntity> {
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
