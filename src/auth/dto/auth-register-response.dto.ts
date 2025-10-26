import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ApiResponseDto } from '@/domains/api-response.dto';

export class AuthRegisterResponseDto {
  @ApiProperty({ type: String })
  result: string;
}

export class ApiRegisterResponseDto extends IntersectionType(
  ApiResponseDto,
  AuthRegisterResponseDto,
) {}
