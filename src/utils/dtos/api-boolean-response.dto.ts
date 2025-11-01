import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';

export class BooleanResponseDto {
  @ApiProperty({ type: Boolean })
  result: boolean;
}

export class ApiBooleanResponseDto extends IntersectionType(
  ApiResponseDto,
  BooleanResponseDto,
) {}
