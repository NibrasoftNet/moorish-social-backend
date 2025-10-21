import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { CompanyOfferDto } from '../../company-offer/dto/company-offer.dto';
import { UserDto } from '../../users/user/user.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';

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
