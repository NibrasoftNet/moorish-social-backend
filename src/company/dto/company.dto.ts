import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { FileDto } from '../../files/dto/file.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { AddressDto } from '../../address/dto/address.dto';
import { CompanySubscriptionTokenDto } from '../../company-subscription-token/dto/company-subscription-token.dto';
import { CompanyCategoryDto } from '../../company-category/dto/company-category.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponseDto } from '@/domains/api-response.dto';
import { PaginationDto } from '@/domains/pagination.dto';

export class CompanyDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  tenantId: string;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  name: string;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  description: string;

  @AutoMap()
  @ApiPropertyOptional({ nullable: true })
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  registrationNumber: string;

  @AutoMap(() => [UserTenantDto])
  @ApiPropertyOptional({ type: UserTenantDto, isArray: true, nullable: true })
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  tenants: UserTenantDto[];

  @AutoMap(() => FileDto)
  @ApiPropertyOptional({ type: FileDto, nullable: true })
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  image: FileDto;

  @AutoMap(() => AddressDto)
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  address: AddressDto;

  @AutoMap()
  @ApiPropertyOptional({ type: Date, nullable: true })
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  deletedAt: Date;

  @AutoMap()
  @ApiProperty({ type: Number })
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  availableSubscriptionTokens: number;

  @AutoMap(() => [CompanySubscriptionTokenDto])
  @ApiPropertyOptional({ type: CompanySubscriptionTokenDto, isArray: true })
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  subscriptions: CompanySubscriptionTokenDto[];

  @AutoMap(() => [CompanyCategoryDto])
  @ApiProperty({ type: CompanyCategoryDto, isArray: true })
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  categories: CompanyCategoryDto;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  hexColor: string;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  verified: boolean;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;
}

export class ApiCompanyDto extends ApiResponseDto {
  @ApiProperty({ type: CompanyDto })
  result: CompanyDto;
}

export class PaginatedCompanyDto extends PaginationDto {
  @ApiProperty({ type: [CompanyDto] })
  data: CompanyDto[];
}

export class ApiCompanyPaginatedDto extends ApiResponseDto {
  @ApiProperty({ type: PaginatedCompanyDto })
  result: PaginatedCompanyDto;
}
