import { AutoMap } from 'automapper-classes';
import { CompanyDto } from '@/domains/company/company.dto';
import { TokenCategoryDto } from '@/domains/token-category/token-category.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class CompanySubscriptionTokenDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  tenantId: string;

  @AutoMap(() => CompanyDto)
  company: CompanyDto;

  @AutoMap(() => TokenCategoryDto)
  category: TokenCategoryDto;
}
