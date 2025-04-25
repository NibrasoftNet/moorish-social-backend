import { AutoMap } from 'automapper-classes';
import { RequestStatusEnum } from '@/enums/request-status.enum';
import { FileDto } from '@/domains/files/file.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { CompanyDto } from '@/domains/company/company.dto';
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';
import { CompanyTenderDto } from '@/domains/company-tender/company-tender.dto';

export class CompanyParticipationCompanyTenderDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => [FileDto])
  documents: FileDto[];

  @AutoMap()
  title: string;

  @AutoMap()
  content: string;

  @AutoMap()
  status: RequestStatusEnum;

  @AutoMap(() => [CompanyTenderDto])
  tender: CompanyTenderDto[];

  @AutoMap(() => CompanyDto)
  company: CompanyDto;

  @AutoMap(() => UserTenantDto)
  creator: UserTenantDto;
}
