import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { OtpEntity } from './entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { NullableType } from '../utils/types/nullable.type';
import { MailService } from '../mail/mail.service';
import { ResendVerifyOtpDto } from './dto/verifyotp.dto';
import { CreateOtpDto } from './dto/create-otp.dto';
import { OtpDto } from './dto/otp.dto';
import { ConfirmOtpEmailDto } from './dto/confirm-otp-email.dto';
import otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  public constructor(
    private readonly configService: ConfigService,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private readonly i18n: I18nService, // Inject i18n service
    private mailService: MailService,
  ) {}

  /**
   * Get all non-confirmed otp list
   * @returns {OtpEntity[]} created otp
   */
  async findAll(): Promise<OtpEntity[]> {
    return await this.otpRepository.find();
  }

  /**
   * Send single pending otp
   * @returns {Promise<OtpEntity>} created otp
   * @param field
   * @param relations
   */
  async findOne(
    field: FindOptionsWhere<OtpEntity>,
    relations?: FindOptionsRelations<OtpEntity>,
  ): Promise<NullableType<OtpEntity>> {
    return await this.otpRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<OtpEntity>,
    relations?: FindOptionsRelations<OtpEntity>,
  ): Promise<OtpEntity> {
    return await this.otpRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  /**
   * Delete a otp by ID
   * @param id {number} otp ID
   * @returns {Promise<DeleteResult>} deletion result
   */
  async remove(id: number): Promise<DeleteResult> {
    return await this.otpRepository.delete(id);
  }

  /**
   * Resend
   * @returns {id} otp is for confirmation
   * @param resendVerifyOtpDto
   */
  async resendOtp(resendVerifyOtpDto: ResendVerifyOtpDto): Promise<boolean> {
    //Create new OTP instance if email not found
    const oldOtp = await this.findOne({ email: resendVerifyOtpDto.email });
    const otp = oldOtp
      ? oldOtp
      : this.otpRepository.create(resendVerifyOtpDto as DeepPartial<OtpEntity>);
    // Generate new OTP
    const otpNumber = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Calculate expiration time
    const expireIn = this.getExpirationDate();
    otp.expireIn = expireIn.getTime();
    otp.otp = otpNumber.toString();
    //Send otp by mail
    await this.mailService.resendOtp({
      to: resendVerifyOtpDto.email,
      data: {
        otp: Number(otpNumber),
      },
    });
    // Save resent Otp entity
    await this.otpRepository.save(otp);
    return true;
  }

  async createOtp(createOtpDto: CreateOtpDto): Promise<string> {
    // Generate a random 6-digit OTP
    const otpNumber = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Calculate expiration time
    const expireIn = this.getExpirationDate();

    // Check if OTP already exists for the given email
    const existingOtp = await this.otpRepository.findOne({
      where: { email: createOtpDto.email },
    });

    if (existingOtp) {
      // Update existing OTP and expiry date
      existingOtp.otp = otpNumber;
      existingOtp.expireIn = expireIn.getTime();

      await this.otpRepository.save(existingOtp);
    } else {
      // Create new OTP entity if not found
      const otpData = new OtpDto(
        createOtpDto.email,
        otpNumber,
        expireIn.getTime(),
      );
      const otp = this.otpRepository.create(otpData);
      await this.otpRepository.save(otp);
    }

    return otpNumber;
  }

  async verifyOtp(
    confirmOtpEmailDto: ConfirmOtpEmailDto,
    deleteOtp?: boolean,
  ): Promise<boolean> {
    const otpRecord = await this.otpRepository.findOne({
      where: { email: confirmOtpEmailDto.email },
    });
    if (!otpRecord) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            otp: this.i18n.t('auth.otpNotFound', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const currentTime = new Date().getTime();
    if (currentTime > otpRecord.expireIn) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            otp: this.i18n.t('auth.otpExpired', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const isOtpValid = await bcrypt.compare(
      confirmOtpEmailDto.otp,
      otpRecord.otp,
    ); // Swap arguments
    if (!isOtpValid) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            otp: this.i18n.t('auth.invalidOtp', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    otpRecord.validated = true;

    // OTP is valid, delete the record from database
    if (deleteOtp) {
      await this.delete(otpRecord.id);
    } else {
      await this.otpRepository.save(otpRecord);
    }
    return true;
  }

  async validateVerification(email: string) {
    const otpRecord = await this.findOne({
      email,
    });
    if (otpRecord && !otpRecord.validated) {
      await this.otpRepository.delete(otpRecord.id);
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            otp: this.i18n.t('auth.invalidOtp', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    if (!otpRecord) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            otp: this.i18n.t('auth.otpNotFound', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    await this.delete(otpRecord.id);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.otpRepository.delete(id);
  }

  private getExpirationDate(): Date {
    const expireIn = new Date();
    const expirationTimeInSeconds = this.configService.getOrThrow<number>(
      'OTP_EXPIRATION_TIME',
      180,
      { infer: true },
    );
    expireIn.setMilliseconds(
      expireIn.getMilliseconds() + expirationTimeInSeconds * 1000,
    );
    return expireIn;
  }
}
