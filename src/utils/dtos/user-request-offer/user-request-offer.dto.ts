import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '../general/entity-helper.dto';
import { CompanyOfferDto } from '@/domains/company-offer/company-offer.dto';
import { UserDto } from '@/domains/user/user.dto';
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';

export class UserRequestOfferDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  request: string;

  @AutoMap(() => CompanyOfferDto)
  offer: CompanyOfferDto;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap(() => UserTenantDto)
  answerer: UserTenantDto;

  @AutoMap()
  response: string;

  @AutoMap()
  closed: boolean;
}
