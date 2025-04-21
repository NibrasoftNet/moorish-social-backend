import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../../files/entities/file.entity';
import { FileDto } from '@/domains/files/file.dto';
import { UserDto } from '@/domains/user/user.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { TenderCategoryDto } from '@/domains/tender-category/tender-category.dto';

export class UserTenderDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => [FileDto])
  documents: FileEntity[];

  @AutoMap()
  title: string;

  @AutoMap()
  content: string;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap(() => TenderCategoryDto)
  category: TenderCategoryDto;
}
