import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CompanyOfferPublicService } from './company-offer-public.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../roles/roles.guard';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Roles } from '../../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CompanyOfferEntity } from '../entities/company-offer.entity';
import { ApiCompanyOfferPaginatedDto, CompanyOfferDto } from '../dto/company-offer.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../../utils/serialization/paginated.dto';
import { companyOfferPaginationConfig } from '../config/company-offer-pagination-config';
import { NullableType } from '../../utils/types/nullable.type';

@ApiTags('Company Offers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'company-offers',
  version: '1',
})
export class CompanyOfferPublicController {
  constructor(
    private readonly companyOfferService: CompanyOfferPublicService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiOkResponse({ description: "Create new company offer", type: ApiCompanyOfferPaginatedDto })
  @ApiPaginationQuery(companyOfferPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CompanyOfferEntity, CompanyOfferDto>> {
    const offers = await this.companyOfferService.findAll(query);
    return new PaginatedDto<CompanyOfferEntity, CompanyOfferDto>(
      this.mapper,
      offers,
      CompanyOfferEntity,
      CompanyOfferDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(CompanyOfferEntity, CompanyOfferDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CompanyOfferEntity>> {
    return await this.companyOfferService.findOne({ id });
  }
}
