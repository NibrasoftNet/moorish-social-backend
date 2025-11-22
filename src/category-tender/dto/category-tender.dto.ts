import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@/domains/api-response.dto';

export class CategoryTenderDto extends EntityHelperDto {
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
}

export class ApiCategoryTenderDto extends ApiResponseDto {
  @ApiProperty({ type: CategoryTenderDto, isArray: true })
  result: CategoryTenderDto[];
}
