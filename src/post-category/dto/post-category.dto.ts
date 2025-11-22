import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PostCategoryDto extends EntityHelperDto {
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

export class ApiPostCategoryDto extends ApiResponseDto {
  @ApiProperty({ type: PostCategoryDto, isArray: true })
  result: PostCategoryDto[];
}
