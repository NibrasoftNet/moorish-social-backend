import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryPostOfferDto extends EntityHelperDto {
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

export class ApiCategoryPostOfferDto extends ApiResponseDto {
  @ApiProperty({ type: CategoryPostOfferDto, isArray: true })
  result: CategoryPostOfferDto[];
}
