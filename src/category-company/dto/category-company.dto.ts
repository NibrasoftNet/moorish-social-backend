import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryCompanyDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap(() => [Object])
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: {
      en: 'Painting',
      fr: 'Peinture',
      ar: 'دهان',
    },
  })
  label: Record<string, string>;

  @AutoMap()
  @ApiProperty()
  value: string;

  @AutoMap(() => CategoryCompanyDto)
  @ApiPropertyOptional({ type: CategoryCompanyDto, nullable: true })
  parent: CategoryCompanyDto;

  @AutoMap(() => [CategoryCompanyDto])
  children: CategoryCompanyDto[];
}
export class ApiCategoryCompanyDto extends ApiResponseDto {
  @ApiProperty({ type: CategoryCompanyDto, isArray: true })
  result: CategoryCompanyDto[];
}
