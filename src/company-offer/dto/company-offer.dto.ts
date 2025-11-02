import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '../../files/dto/file.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { PostCategoryDto } from '../../post-category/dto/post-category.dto';
import { ApiResponseDto } from '@/domains/api-response.dto';

export class CompanyOfferDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap(() => [FileDto])
  @ApiProperty()
  files: FileDto[];

  @AutoMap()
  @ApiProperty()
  title: string;

  @AutoMap()
  @ApiProperty()
  content: string;

  @AutoMap()
  @ApiProperty()
  hashTag: string;

  @AutoMap()
  @ApiProperty()
  boostScore: number;

  @AutoMap(() => CompanyDto)
  @ApiProperty()
  company: CompanyDto;

  @AutoMap(() => UserTenantDto)
  @ApiProperty()
  creator: UserTenantDto;

  @AutoMap(() => PostCategoryDto)
  @ApiProperty()
  category: PostCategoryDto;
}
export class ApiCompanyOfferDto extends ApiResponseDto {
  @ApiProperty({ type: CompanyOfferDto })
  result: CompanyOfferDto;
}
