import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

export class CreateUserTenantDto {
  @ApiProperty({ example: 'test1@tenant.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['UserTenantEntity', 'validation.emailAlreadyExists'])
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'H@mza12345' })
  @IsOptional()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password?: string;

  @ApiPropertyOptional({ example: '0021655456398' })
  @IsOptional()
  @IsString()
  whatsApp?: string;

  @ApiPropertyOptional({ example: 'Manager' })
  @IsOptional()
  @IsString()
  position?: string;
}
