import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyCategoryDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  label: string;

  @AutoMap()
  @ApiProperty()
  value: string;

  @AutoMap(() => CompanyCategoryDto)
  @ApiPropertyOptional({ type: CompanyCategoryDto, nullable: true })
  parent: CompanyCategoryDto;

  @AutoMap(() => [CompanyCategoryDto])
  children: CompanyCategoryDto[];
}
export class ApiCompanyCategoryDto extends ApiResponseDto {
  @ApiProperty({ type: CompanyCategoryDto, isArray: true })
  result: CompanyCategoryDto[];
}
