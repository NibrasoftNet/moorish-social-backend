import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { FileDto } from '../../files/dto/file.dto';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusesDto } from '../../statuses/dto/statuses.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @Validate(IsNotExist, ['UserEntity', 'validation.emailAlreadyExists'])
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  userName?: string;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id', 'validation.imageNotExists'])
  photo?: FileDto;

  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Validate(IsExist, ['Role', 'id', 'validation.roleNotExists'])
  role?: RoleDto;

  @ApiProperty({ type: StatusesDto })
  @IsOptional()
  @Validate(IsExist, ['Status', 'id', 'validation.statusNotExists'])
  status?: StatusesDto;

  hash?: string | null;
}
