import { AutoMap } from 'automapper-classes';
import { CompanyDto } from '../../company/dto/company.dto';
import { TokenCategoryDto } from '../../token-category/dto/token-category.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';

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
