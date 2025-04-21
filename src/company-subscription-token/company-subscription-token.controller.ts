import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CompanySubscriptionTokenService } from './company-subscription-token.service';
import { CreateCompanySubscriptionTokenDto } from '@/domains/company-subscription-token/create-company-subscription-token.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CompanySubscriptionTokenEntity } from './entities/company-subscription-token.entity';
import { CompanySubscriptionTokenDto } from '@/domains/company-subscription-token/company-subscription-token.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { companySubscriptionTokenPaginationConfig } from './config/company-subscription-token-pagination-config';
import { PaginatedDto } from 'src/utils/serialization/paginated.dto';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';

@ApiTags('Subscription Tokens')
@ApiHeader({
  name: 'tenant-id',
  required: true,
  description: 'Tenant-Id header',
  schema: { type: 'string' },
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'subscription-tokens' })
export class CompanySubscriptionTokenController {
  constructor(
    private readonly subscriptionTokenService: CompanySubscriptionTokenService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(
    MapInterceptor(CompanySubscriptionTokenEntity, CompanySubscriptionTokenDto),
  )
  @Roles(RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Param('reservationId') reservationId: string,
    @Body() createSubscriptionTokenDto: CreateCompanySubscriptionTokenDto,
  ): Promise<CompanySubscriptionTokenEntity> {
    return await this.subscriptionTokenService.create(
      createSubscriptionTokenDto,
    );
  }

  @ApiPaginationQuery(companySubscriptionTokenPaginationConfig)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedDto<CompanySubscriptionTokenEntity, CompanySubscriptionTokenDto>
  > {
    const matches = await this.subscriptionTokenService.findAll(query);
    return new PaginatedDto<
      CompanySubscriptionTokenEntity,
      CompanySubscriptionTokenDto
    >(
      this.mapper,
      matches,
      CompanySubscriptionTokenEntity,
      CompanySubscriptionTokenDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(CompanySubscriptionTokenEntity, CompanySubscriptionTokenDto),
  )
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CompanySubscriptionTokenEntity>> {
    return await this.subscriptionTokenService.findOne({ id });
  }

  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id')
    id: string,
  ): Promise<DeleteResult> {
    return await this.subscriptionTokenService.remove(id);
  }
}
