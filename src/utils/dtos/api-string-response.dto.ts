import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';

export class StringResponseDto {
  @ApiProperty({ type: String })
  result: string;
}

export class ApiStringResponseDto extends IntersectionType(
  ApiResponseDto,
  StringResponseDto,
) {}
