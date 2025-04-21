import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class TenderCategoryDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}
