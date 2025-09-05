import { AutoMap } from 'automapper-classes';
import { RequestStatusEnum } from '@/enums/request-status.enum';
import { FileDto } from '../../files/dto/file.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';
import { CompanyTenderDto } from '../../company-tender/dto/company-tender.dto';

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
