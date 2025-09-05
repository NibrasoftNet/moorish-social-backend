import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { IsExist } from '../../utils/validators/is-exists.validator';

export class AuthAdminForgotPasswordDto {
  @ApiProperty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @Validate(IsExist, ['UserTenantEntity', 'email', 'validation.emailNotExists'])
  email: string;
}
