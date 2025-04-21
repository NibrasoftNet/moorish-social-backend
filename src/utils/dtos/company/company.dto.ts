import { AutoMap } from 'automapper-classes';
import { Expose } from 'class-transformer';
import { FileDto } from '@/domains/files/file.dto';
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { AddressDto } from '../address/address.dto';
import { CompanySubscriptionTokenDto } from '@/domains/company-subscription-token/company-subscription-token.dto';
import { CompanyCategoryDto } from '@/domains/company-category/company-category.dto';

export class CompanyDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  tenantId: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  name: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  description: string;

  @AutoMap(() => [UserTenantDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  tenants: UserTenantDto[];

  @AutoMap(() => FileDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  image: FileDto;

  @AutoMap(() => AddressDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  address: AddressDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  deletedAt: Date;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  availableSubscriptionTokens: number;

  @AutoMap(() => [CompanySubscriptionTokenDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  subscriptions: CompanySubscriptionTokenDto[];

  @AutoMap(() => CompanyCategoryDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  category: CompanyCategoryDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  hexColor: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;
}
