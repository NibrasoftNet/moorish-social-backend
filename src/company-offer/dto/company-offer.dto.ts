import { AutoMap } from 'automapper-classes';
import { FileDto } from '../../files/dto/file.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { PostCategoryDto } from '../../post-category/dto/post-category.dto';

export class CompanyOfferDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => [FileDto])
  files: FileDto[];

  @AutoMap()
  title: string;

  @AutoMap()
  content: string;

  @AutoMap()
  hashTag: string;

  @AutoMap()
  boostScore: number;

  //@AutoMap(() => CompanyDto)
  company: CompanyDto;

  @AutoMap(() => UserTenantDto)
  creator: UserTenantDto;

  @AutoMap(() => PostCategoryDto)
  category: PostCategoryDto;
}
