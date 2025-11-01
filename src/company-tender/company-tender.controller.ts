import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Request,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthRequest } from '../utils/types/auth-request.type';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Utils } from '../utils/utils';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';
import { CompanyTenderService } from './company-tender.service';
import { CreateCompanyTenderDto } from './dto/create-company-tender.dto';
import { CompanyTenderEntity } from './entities/company-tender.entity';
import { CompanyTenderDto } from './dto/company-tender.dto';
import { companyTenderPaginationConfig } from './config/company-tender-pagination.config';
import { UpdateCompanyTenderDto } from './dto/update-company-tender.dto';

@ApiTags('Company Tenders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'company-tenders',
  version: '1',
})
export class CompanyTenderController {
  constructor(
    private readonly companyTenderService: CompanyTenderService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCompanyTenderDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(CreateCompanyTenderDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN)
  @UseInterceptors(MapInterceptor(CompanyTenderEntity, CompanyTenderDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  @Post('companies/:companyId/categories/:categoryId')
  async create(
    @Request() request: AuthRequest,
    @Param('companyId') companyId: string,
    @Param('categoryId') categoryId: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyTenderEntity> {
    const createTenderDto = await Utils.validateDtoOrFail(
      CreateCompanyTenderDto,
      data,
    );
    return await this.companyTenderService.create(
      request.user,
      companyId,
      categoryId,
      createTenderDto,
      files,
    );
  }

  @ApiPaginationQuery(companyTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CompanyTenderEntity, CompanyTenderDto>> {
    const tenders = await this.companyTenderService.findAll(query);
    return new PaginatedDto<CompanyTenderEntity, CompanyTenderDto>(
      this.mapper,
      tenders,
      CompanyTenderEntity,
      CompanyTenderDto,
    );
  }

  @ApiPaginationQuery(companyTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('companies/:companyId')
  async findAllOthers(
    @Param('companyId') companyId: string,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CompanyTenderEntity, CompanyTenderDto>> {
    const tenders = await this.companyTenderService.findAllOthers(
      companyId,
      query,
    );
    return new PaginatedDto<CompanyTenderEntity, CompanyTenderDto>(
      this.mapper,
      tenders,
      CompanyTenderEntity,
      CompanyTenderDto,
    );
  }

  @ApiPaginationQuery(companyTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request: AuthRequest,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CompanyTenderEntity, CompanyTenderDto>> {
    const tenders = await this.companyTenderService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<CompanyTenderEntity, CompanyTenderDto>(
      this.mapper,
      tenders,
      CompanyTenderEntity,
      CompanyTenderDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(CompanyTenderEntity, CompanyTenderDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CompanyTenderEntity>> {
    return await this.companyTenderService.findOne(
      { id },
      { participants: { company: { image: true } } },
    );
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateCompanyTenderDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(UpdateCompanyTenderDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(CompanyTenderEntity, CompanyTenderDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyTenderEntity> {
    const updateTenderDto = await Utils.validateDtoOrFail(
      UpdateCompanyTenderDto,
      data,
    );
    return this.companyTenderService.update(id, updateTenderDto, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.companyTenderService.remove(id);
  }
}
