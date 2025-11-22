import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { NullableType } from '../../utils/types/nullable.type';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../../utils/serialization/paginated.dto';
import { Mapper } from '@automapper/core';
import { CompanyEntity } from '../entities/company.entity';
import {
  ApiCompanyDto,
  ApiCompanyPaginatedDto,
  CompanyDto,
} from '../dto/company.dto';
import { companyPaginationConfig } from '../config/company-pagination-config';
import { CompanyPublicService } from './company-public.service';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller({ version: '1', path: 'companies' })
export class CompanyPublicController {
  constructor(
    private readonly companyService: CompanyPublicService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiOkResponse({
    type: ApiCompanyPaginatedDto,
    description: 'List of companies',
  })
  @ApiPaginationQuery(companyPaginationConfig)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CompanyEntity, CompanyDto>> {
    const complexes = await this.companyService.findAll(query);
    return new PaginatedDto<CompanyEntity, CompanyDto>(
      this.mapper,
      complexes,
      CompanyEntity,
      CompanyDto,
    );
  }

  @ApiOkResponse({
    type: ApiCompanyDto,
    description: 'Get Single company with id',
  })
  @UseInterceptors(MapInterceptor(CompanyEntity, CompanyDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<CompanyEntity>> {
    return await this.companyService.findOne(
      { id },
      { categories: { parent: true }, tenants: true },
    );
  }
}
