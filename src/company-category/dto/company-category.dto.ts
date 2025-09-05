import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';

export class CompanyCategoryDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  label: string;

  @AutoMap()
  value: string;

  @AutoMap(() => CompanyCategoryDto)
  parent: CompanyCategoryDto;

  @AutoMap(() => [CompanyCategoryDto])
  children: CompanyCategoryDto[];
}
