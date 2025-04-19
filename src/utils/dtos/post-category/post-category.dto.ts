import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class PostCategoryDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap(() => [PostCategoryDto])
  posts: PostCategoryDto[];
}
