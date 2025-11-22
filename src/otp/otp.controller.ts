import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OtpEntity } from './entities/otp.entity';
import { DeleteResult } from 'typeorm';
import { ConfirmOtpEmailDto } from './dto/confirm-otp-email.dto';
import { ResendVerifyOtpDto } from './dto/verifyotp.dto';
import { ApiBooleanResponseDto } from '@/domains/api-boolean-response.dto';

@ApiTags('Otp')
@Controller({
  path: 'otp',
  version: '1',
})
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @ApiBody({
    description: 'Confirm OTP verification code',
    type: ConfirmOtpEmailDto,
  })
  @ApiCreatedResponse({
    description: ' Create OTP verification code',
    type: ApiBooleanResponseDto,
  })
  @Post('verify')
  @HttpCode(HttpStatus.CREATED)
  async verifyOtp(
    @Body() confirmOtpEmailDto: ConfirmOtpEmailDto,
    deleteOtp?: boolean,
  ): Promise<boolean> {
    return await this.otpService.verifyOtp(confirmOtpEmailDto, deleteOtp);
  }
  /**
   * Get all not confirmed otp
   * @returns {Promise<OtpEntity[]>} List of all non-confirmed otp
   */

  @Get()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<OtpEntity[]> {
    return await this.otpService.findAll();
  }

  /**
   * Delete otp by ID
   * @param id {number} category ID
   * @returns {Promise<DeleteResult>} deletion result
   */

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.otpService.remove(id);
  }

  /**
   * re-Send Otp to received phone
   * @returns {void}
   * @param resendVerifyOtpDto
   */

  @ApiBody({
    description: 'Resend OTP verification code',
    type: ResendVerifyOtpDto,
  })
  @ApiOkResponse({
    description: ' OTP send with success',
    type: ApiBooleanResponseDto,
  })
  @Put('resend')
  @HttpCode(HttpStatus.CREATED)
  async resendOtp(
    @Body() resendVerifyOtpDto: ResendVerifyOtpDto,
  ): Promise<boolean> {
    return await this.otpService.resendOtp(resendVerifyOtpDto);
  }
}
