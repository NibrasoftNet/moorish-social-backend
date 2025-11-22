import { AutoMap } from '@automapper/classes';
import { FileEntity } from '../../files/entities/file.entity';
import { FileDto } from '../../files/dto/file.dto';
import { UserDto } from '../../users/user/user.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { CategoryTenderDto } from '../../category-tender/dto/category-tender.dto';

export class UserTenderDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => [FileDto])
  documents: FileEntity[];

  @AutoMap()
  title: string;

  @AutoMap()
  content: string;

  @AutoMap()
  active: boolean;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap(() => CategoryTenderDto)
  category: CategoryTenderDto;
}
