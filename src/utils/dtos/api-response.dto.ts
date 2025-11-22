import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorMessageDto {
  @ApiProperty()
  errors: Record<string, string>;

  @ApiProperty({ description: 'HTTP status code of the error response' })
  status: number;
}

export class ApiResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ description: 'HTTP status code of the error response' })
  statusCode: number;

  @ApiPropertyOptional()
  message?: ErrorMessageDto;

  @ApiPropertyOptional({ example: 'Error stack trace if any' })
  stack?: string;
}
