import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';

export class TenderCategoryDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  label: string;

  @AutoMap()
  value: string;
}
