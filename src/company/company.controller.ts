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
  Put,
  Request,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeader,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { NullableType } from '../utils/types/nullable.type';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from 'automapper-core';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { DeleteResult } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { CompanyDto } from '@/domains/company/company.dto';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from '@/domains/company/create-company.dto';
import { UpdateCompanyDto } from '@/domains/company/update-company.dto';
import { companyPaginationConfig } from './config/company-pagination-config';
import { AuthRequest } from 'src/utils/types/auth-request.type';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Companies')
@ApiHeader({
  name: 'tenant-id',
  required: true,
  description: 'Tenant-Id header',
  schema: { type: 'string' },
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'companies' })
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCompanyDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(CreateCompanyDto),
        },
      },
    },
  })
  @UseInterceptors(MapInterceptor(CompanyEntity, CompanyDto))
  @UseInterceptors(FileInterceptor('file'))
  @Roles(RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('categories/categoryId')
  async create(
    @Request() request: AuthRequest,
    @Param('categoryId') categoryId: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyEntity> {
    const createCompanyDto = new CreateCompanyDto(data);
    await Utils.validateDtoOrFail(createCompanyDto);
    return await this.companyService.create(
      request.user,
      categoryId,
      createCompanyDto,
      file,
    );
  }

  @ApiPaginationQuery(companyPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
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

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(CompanyEntity, CompanyDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<CompanyEntity>> {
    return await this.companyService.findOne({ id }, { subscriptions: true });
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateCompanyDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(UpdateCompanyDto),
        },
      },
    },
  })
  @UseInterceptors(MapInterceptor(CompanyEntity, CompanyDto))
  @UseInterceptors(FileInterceptor('file'))
  @Roles(RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyEntity> {
    const updateComplexDto = new UpdateCompanyDto(data);
    await Utils.validateDtoOrFail(updateComplexDto);
    return this.companyService.update(id, updateComplexDto, file);
  }

  @Roles(RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id', IsCreatorPipe('Complex', 'id', 'creator')) id: string,
  ): Promise<DeleteResult> {
    return await this.companyService.remove(id);
  }
}
