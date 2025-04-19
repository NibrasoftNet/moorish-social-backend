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
import { SubscriptionTokenService } from './subscription-token.service';
import { CreateSubscriptionTokenDto } from '@/domains/subscription-token/create-subscription-token.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { SubscriptionTokenEntity } from './entities/subscription-token.entity';
import { SubscriptionTokenDto } from '@/domains/subscription-token/subscription-token.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { subscriptionTokenPaginationConfig } from './config/subscription-token-pagination-config';
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
export class SubscriptionTokenController {
  constructor(
    private readonly subscriptionTokenService: SubscriptionTokenService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(
    MapInterceptor(SubscriptionTokenEntity, SubscriptionTokenDto),
  )
  @Roles(RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Param('reservationId') reservationId: string,
    @Body() createSubscriptionTokenDto: CreateSubscriptionTokenDto,
  ): Promise<SubscriptionTokenEntity> {
    return await this.subscriptionTokenService.create(
      createSubscriptionTokenDto,
    );
  }

  @ApiPaginationQuery(subscriptionTokenPaginationConfig)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<SubscriptionTokenEntity, SubscriptionTokenDto>> {
    const matches = await this.subscriptionTokenService.findAll(query);
    return new PaginatedDto<SubscriptionTokenEntity, SubscriptionTokenDto>(
      this.mapper,
      matches,
      SubscriptionTokenEntity,
      SubscriptionTokenDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(SubscriptionTokenEntity, SubscriptionTokenDto),
  )
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<SubscriptionTokenEntity>> {
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
