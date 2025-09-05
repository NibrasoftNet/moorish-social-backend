import { AutoMap } from 'automapper-classes';
import { RequestStatusEnum } from '@/enums/request-status.enum';
import { FileDto } from '../../files/dto/file.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { UserTenderDto } from '../../user-tender/dto/user-tender.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';

export class CompanyParticipationUserTenderDto extends EntityHelperDto {
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

  @AutoMap(() => [UserTenderDto])
  tender: UserTenderDto[];

  @AutoMap(() => CompanyDto)
  company: CompanyDto;

  @AutoMap(() => UserTenantDto)
  creator: UserTenantDto;
}
