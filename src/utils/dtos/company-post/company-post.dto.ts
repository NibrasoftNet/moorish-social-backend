import { AutoMap } from 'automapper-classes';
import { FileDto } from '@/domains/files/file.dto';
import { CompanyDto } from '@/domains/company/company.dto';
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { PostCategoryDto } from '@/domains/post-category/post-category.dto';

export class CompanyPostDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => [FileDto])
  images: FileDto[];

  @AutoMap()
  title: string;

  @AutoMap()
  content: string;

  @AutoMap()
  hashTag: string;

  @AutoMap()
  boostScore: number;

  @AutoMap()
  active: boolean;

  @AutoMap(() => CompanyDto)
  company: CompanyDto;

  @AutoMap(() => UserTenantDto)
  creator: UserTenantDto;

  @AutoMap(() => PostCategoryDto)
  category: PostCategoryDto;
}
