import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test@weavers.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  @Validate(IsExist, ['UserEntity', 'email', 'validation.emailNotExists'])
  email: string;

  @ApiProperty({ example: 'H@mza12345' })
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 5,
      minLowercase: 0,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    },
    {
      message: 'validation.notStrongPass',
    },
  )
  password: string;

  @ApiProperty({ example: 'xe8emg58q2x27ohlfuz7n76u3btbzz4a' })
  @IsString()
  @IsOptional()
  notificationsToken?: string;
}
