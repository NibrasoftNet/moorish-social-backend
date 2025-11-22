import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileDto } from '../../files/dto/file.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { CategoryPostOfferDto } from '../../category-post-offer/dto/category-post-offer.dto';
import { Expose } from 'class-transformer';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { PaginationDto } from '@/domains/pagination.dto';

export class CompanyPostDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => [FileDto])
  @ApiPropertyOptional({ type: FileDto, isArray: true, nullable: true })
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  images: FileDto[];

  @AutoMap()
  @ApiProperty()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  title: string;

  @AutoMap()
  @ApiProperty()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  content: string;

  @AutoMap()
  @ApiProperty()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  hashTag: string;

  @AutoMap()
  @ApiProperty()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  boostScore: number;

  @AutoMap()
  @ApiProperty()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;

  @AutoMap(() => CompanyDto)
  @ApiProperty()
  company: CompanyDto;

  @AutoMap(() => UserTenantDto)
  @ApiProperty()
  creator: UserTenantDto;

  @AutoMap(() => CategoryPostOfferDto)
  @ApiProperty()
  category: CategoryPostOfferDto;
}

export class ApiCompanyPostDto extends ApiResponseDto {
  @ApiProperty({ type: CompanyPostDto })
  result: CompanyPostDto;
}

export class PaginatedCompanyPostDto extends PaginationDto {
  @ApiProperty({ type: [CompanyPostDto] })
  data: CompanyPostDto[];
}

export class ApiCompanyPostPaginatedDto extends ApiResponseDto {
  @ApiProperty({ type: PaginatedCompanyPostDto })
  result: PaginatedCompanyPostDto;
}
