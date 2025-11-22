import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompanyPostPublicService } from './company-post-public.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../roles/roles.guard';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Roles } from '../../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CompanyPostEntity } from '../entities/company-post.entity';
import {
  ApiCompanyPostDto,
  ApiCompanyPostPaginatedDto,
  CompanyPostDto,
} from '../dto/company-post.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../../utils/serialization/paginated.dto';
import { companyPostPaginationConfig } from '../config/company-post-pagination-config';
import { NullableType } from '../../utils/types/nullable.type';

@ApiTags('Company Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'company-posts',
  version: '1',
})
export class CompanyPostPublicController {
  constructor(
    private readonly companyPostService: CompanyPostPublicService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiOkResponse({
    description: 'List single company posts',
    type: ApiCompanyPostPaginatedDto,
  })
  @ApiPaginationQuery(companyPostPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CompanyPostEntity, CompanyPostDto>> {
    const posts = await this.companyPostService.findAll(query);
    return new PaginatedDto<CompanyPostEntity, CompanyPostDto>(
      this.mapper,
      posts,
      CompanyPostEntity,
      CompanyPostDto,
    );
  }

  @ApiOkResponse({
    description: 'Single company post',
    type: ApiCompanyPostDto,
  })
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(CompanyPostEntity, CompanyPostDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NullableType<CompanyPostEntity>> {
    return await this.companyPostService.findOne({ id });
  }
}
