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
import { NullableType } from '../utils/types/nullable.type';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { AuthResetPasswordDto } from '@/domains/auth/auth-reset-password.dto';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';
import { CreateUserDto } from '@/domains/user/create-user.dto';
import { AuthNewPasswordDto } from '@/domains/auth/auth-new-password.dto';
import { AuthTenantService } from './auth-tenant.service';
import { SessionAdminResponseDto } from '@/domains/session/session-admin-response.dto';
import { UserTenant } from '../users-tenant/entities/user-tenant.entity';
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';
import { FileFastifyInterceptor, MulterFile } from 'fastify-file-interceptor';
import { AuthAdminEmailLoginDto } from '@/domains/auth-admin/auth-admin-email-login.dto';
import { AuthAdminForgotPasswordDto } from '@/domains/auth-admin/auth-admin-forgot-password.dto';

@ApiTags('Auth-admin')
@Controller({
  path: 'auth-admin',
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
  public async me(@Request() request): Promise<SessionAdminResponseDto> {
    return await this.authTenantService.me(request.user);
  }

  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(@Request() request): Promise<SessionAdminResponseDto> {
    return await this.authTenantService.refreshToken({
      id: request.user.id,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async adminLogout(@Request() request): Promise<void> {
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
  @UseInterceptors(MapInterceptor(UserTenant, UserTenantDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  public async update(
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: MulterFile | Express.MulterS3.File,
  ): Promise<NullableType<UserTenant>> {
    const updateUserDto = new AuthUpdateDto(data);
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
    @Request() request,
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
