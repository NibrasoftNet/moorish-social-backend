import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../../files/entities/file.entity';
import { FileDto } from '@/domains/files/file.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { TenderCategoryDto } from '@/domains/tender-category/tender-category.dto';
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';
import { CompanyDto } from '@/domains/company/company.dto';

export class CompanyTenderDto extends EntityHelperDto {
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

  @AutoMap(() => CompanyDto)
  company: CompanyDto;

  @AutoMap(() => UserTenantDto)
  creator: UserTenantDto;

  @AutoMap(() => TenderCategoryDto)
  category: TenderCategoryDto;
}
