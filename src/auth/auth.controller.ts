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
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../users/entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { SessionResponseDto } from '../session/dto/session-response.dto';
import { AuthEmailRegisterDto } from './dto/auth-email-register.dto';
import { ConfirmOtpEmailDto } from '../otp/dto/confirm-otp-email.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { UserDto } from '../users/user/user.dto';
import { AuthNewPasswordDto } from './dto/auth-new-password.dto';
import { AuthRequest } from '../utils/types/auth-request.type';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    @InjectMapper()
    private mapper: Mapper,
  ) {}

  @Post('email-login')
  @ApiResponse({ type: SessionResponseDto })
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<SessionResponseDto> {
    return await this.service.validateLogin(loginDto);
  }

  @Post('email-register')
  @ApiResponse({ type: String })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: AuthEmailRegisterDto): Promise<string> {
    return await this.service.register(createUserDto);
  }

  @Post('email-confirm')
  @ApiResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() confirmOtpEmailDto: ConfirmOtpEmailDto,
  ): Promise<void> {
    return await this.service.confirmEmail(confirmOtpEmailDto);
  }

  @ApiResponse({ type: String })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<string> {
    return await this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    return await this.service.resetPassword(resetPasswordDto);
  }

  @ApiResponse({ type: SessionResponseDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get('me')
  public async me(
    @Request() request: AuthRequest,
  ): Promise<SessionResponseDto> {
    return await this.service.me(request.user);
  }

  @ApiResponse({ type: SessionResponseDto })
  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @Request() request: AuthRequest,
  ): Promise<SessionResponseDto> {
    return await this.service.refreshToken({
      id: request.user.id,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(@Request() request: AuthRequest): Promise<void> {
    await this.service.logout({
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
  @UseInterceptors(MapInterceptor(UserEntity, UserDto))
  @UseInterceptors(FileInterceptor('file'))
  public async update(
    @Request() request: AuthRequest,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<NullableType<UserEntity>> {
    const updateUserDto = await Utils.validateDtoOrFail(AuthUpdateDto, data);
    return await this.service.update(request.user, updateUserDto, file);
  }

  @ApiBearerAuth()
  @Put('me/new-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Request() request: AuthRequest,
    @Body() newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    return await this.service.newPassword(request.user, newPasswordDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() request: AuthRequest): Promise<void> {
    return await this.service.softDelete(request.user);
  }
}
