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
  UploadedFiles,
  Request,
  Put,
} from '@nestjs/common';
import { CompanyOfferService } from './company-offer.service';
import { CreateCompanyOfferDto } from './dto/create-company-offer.dto';
import { UpdateCompanyOfferDto } from './dto/update-company-offer.dto';
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
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CompanyOfferEntity } from './entities/company-offer.entity';
import { CompanyOfferDto } from './dto/company-offer.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { AuthRequest } from '../utils/types/auth-request.type';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from 'src/utils/serialization/paginated.dto';
import { companyOfferPaginationConfig } from './config/company-offer-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';

@ApiTags('Company Offers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'company-offers',
  version: '1',
})
export class CompanyOfferController {
  constructor(
    private readonly companyOfferService: CompanyOfferService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCompanyOfferDto)
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
          $ref: getSchemaPath(CreateCompanyOfferDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.TENANTADMIN)
  @UseInterceptors(MapInterceptor(CompanyOfferEntity, CompanyOfferDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  @Post('companies/:companyId/categories/:categoryId')
  async create(
    @Request() request: AuthRequest,
    @Param('companyId') companyId: string,
    @Param('categoryId') categoryId: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyOfferEntity> {
    const createCompanyOfferDto = new CreateCompanyOfferDto(data);
    await Utils.validateDtoOrFail(createCompanyOfferDto);
    return this.companyOfferService.create(
      request.user,
      companyId,
      categoryId,
      createCompanyOfferDto,
      files,
    );
  }

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

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateCompanyOfferDto)
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
          $ref: getSchemaPath(UpdateCompanyOfferDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.TENANTADMIN)
  @UseInterceptors(MapInterceptor(CompanyOfferEntity, CompanyOfferDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyOfferEntity> {
    const updateCompanyOfferDto = new UpdateCompanyOfferDto(data);
    await Utils.validateDtoOrFail(updateCompanyOfferDto);
    return this.companyOfferService.update(id, updateCompanyOfferDto, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.companyOfferService.remove(id);
  }
}
