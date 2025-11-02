import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '../../files/dto/file.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { UserTenantDto } from '../../users-tenant/dto/user-tenant.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { PostCategoryDto } from '../../post-category/dto/post-category.dto';
import { Expose } from 'class-transformer';
import { ApiResponseDto } from '@/domains/api-response.dto';

export class CompanyPostDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => [FileDto])
  @ApiProperty()
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
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  creator: UserTenantDto;

  @AutoMap(() => PostCategoryDto)
  @ApiProperty()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  category: PostCategoryDto;
}

export class ApiCompanyPostDto extends ApiResponseDto {
  @ApiProperty({ type: CompanyPostDto })
  result: CompanyPostDto;
}
