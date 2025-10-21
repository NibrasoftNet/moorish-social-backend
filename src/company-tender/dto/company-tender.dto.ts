import { AutoMap } from '@automapper/classes';
import { FileEntity } from '../../files/entities/file.entity';
import { FileDto } from '../../files/dto/file.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { TenderCategoryDto } from '../../tender-category/dto/tender-category.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { CompanyParticipationCompanyTenderDto } from '../../company-participation-company-tender/dto/company-participation-company-tender.dto';

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

  @AutoMap(() => [Object])
  specifications: { key: string; value: string };

  @AutoMap(() => Date)
  lastSubmissionDate: Date;

  @AutoMap()
  totalParticipation: number;

  @AutoMap(() => [CompanyParticipationCompanyTenderDto])
  participants: CompanyParticipationCompanyTenderDto[];
}
