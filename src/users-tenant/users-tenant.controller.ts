import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersTenantService } from './users-tenant.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateResult } from 'typeorm';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { UserTenant } from './entities/user-tenant.entity';
import { usersTenantPaginationConfig } from './configs/users-tenant-pagination.config';
import { UserTenantDto } from '@/domains/user-tenant/user-tenant.dto';
import { CreateUserTenantDto } from '@/domains/user-tenant/create-user-tenant.dto';
import { UpdateUserTenantDto } from '@/domains/user-tenant/update-user-tenant.dto';

@ApiBearerAuth()
@ApiTags('Admin-Tenant')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'user-tenants',
  version: '1',
})
export class UsersTenantController {
  constructor(
    private readonly usersTenantService: UsersTenantService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MapInterceptor(UserTenant, UserTenantDto))
  async create(
    @Body() createProfileDto: CreateUserTenantDto,
  ): Promise<UserTenant> {
    return await this.usersTenantService.create(createProfileDto);
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @PaginatedSwaggerDocs(UserTenantDto, usersTenantPaginationConfig)
  async findAllPaginated(@Paginate() query: PaginateQuery) {
    const users = await this.usersTenantService.findManyWithPagination(query);
    return new PaginatedDto<UserTenant, UserTenantDto>(
      this.mapper,
      users,
      UserTenant,
      UserTenantDto,
    );
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(UserTenant, UserTenantDto))
  async findOne(@Param('id') id: string): Promise<NullableType<UserTenant>> {
    return await this.usersTenantService.findOne({ id });
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(UserTenant, UserTenantDto))
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProfileDto: UpdateUserTenantDto,
  ): Promise<UserTenant> {
    return await this.usersTenantService.update(id, updateProfileDto);
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<UpdateResult> {
    return await this.usersTenantService.softDelete(id);
  }
}
