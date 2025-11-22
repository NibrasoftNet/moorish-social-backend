import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@/domains/api-response.dto';

export class TenderCategoryDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  label: string;

  @AutoMap()
  @ApiProperty()
  value: string;
}

export class ApiTenderCategoryDto extends ApiResponseDto {
  @ApiProperty({ type: TenderCategoryDto, isArray: true })
  result: TenderCategoryDto[];
}
