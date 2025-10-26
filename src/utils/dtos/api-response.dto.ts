import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiPropertyOptional()
  message?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Error stack trace if any' })
  stack?: string;
}
