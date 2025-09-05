import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { NotificationEnum } from '@/enums/notification.enum';
import {
  CompareDate,
  DateComparisonMethod,
} from '../../utils/validators/compare-date.validator';

export class ReceiverDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  notificationToken: string;
}

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  forAllUsers: boolean;

  @ApiProperty({
    enum: NotificationEnum,
    example: NotificationEnum.IMMEDIATELY,
  })
  @IsEnum(NotificationEnum)
  @IsNotEmpty()
  typeOfSending: NotificationEnum;

  @ApiProperty({
    description: 'List of notification receivers',
    type: [ReceiverDto],
  })
  @ValidateIf((dto) => dto.forAllUsers === false)
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReceiverDto)
  receivers: ReceiverDto[];

  @ApiProperty({
    description: 'Start date of the tournament',
    example: '2024-12-01T10:00:00.000Z',
  })
  @ValidateIf((dto) => dto.typeOfSending === NotificationEnum.PUNCTUAL)
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @CompareDate(new Date(), DateComparisonMethod.GREATER)
  punctualSendDate?: Date;

  @ApiProperty({
    type: Date,
    isArray: true,
  })
  @ValidateIf((dto) => dto.typeOfSending === NotificationEnum.PROGRAMMED)
  @IsNotEmpty()
  @Transform(({ value }) => value && value.map((date) => new Date(date)))
  @IsDate({ each: true })
  scheduledNotification?: Date[] | null;

  constructor(data: Partial<CreateNotificationDto>) {
    Object.assign(this, data);
  }
}
