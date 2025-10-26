import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { ApiResponseDto } from '@/domains/api-response.dto';

export class AuthAdminEmailLoginDto {
  @ApiProperty({ example: 'test1@tenant.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsExist, ['UserTenantEntity', 'email', 'validation.emailNotExists'])
  email: string;

  @ApiProperty({ example: 'H@mza12345' })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @ApiPropertyOptional({ example: 'xe8emg58q2x27ohlfuz7n76u3btbzz4a' })
  @IsString()
  @IsOptional()
  notificationsToken?: string;
}

export class AuthAdminEmailLoginApiResponseDto extends ApiResponseDto {
  @ApiProperty({ type: AuthAdminEmailLoginDto })
  result: AuthAdminEmailLoginDto;
}
