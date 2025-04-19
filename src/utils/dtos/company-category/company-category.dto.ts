import { AutoMap } from 'automapper-classes';
import { CompanyDto } from '@/domains/company/company.dto';
import { FileDto } from '@/domains/files/file.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class CompanyCategoryDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => FileDto)
  image: FileDto;

  @AutoMap()
  title: string;

  @AutoMap(() => CompanyCategoryDto)
  parent?: CompanyCategoryDto | null;

  @AutoMap(() => [CompanyCategoryDto])
  children: CompanyCategoryDto[];

  @AutoMap(() => [CompanyDto])
  companies: CompanyDto[];
}
