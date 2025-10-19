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
import { CreateCompanyParticipationCompanyTenderDto } from './dto/create-company-participation-company-tender.dto';
import { CompanyParticipationCompanyTenderEntity } from './entities/company-participation-company-tender.entity';
import { CompanyParticipationCompanyTenderDto } from './dto/company-participation-company-tender.dto';
import { CompanyParticipationCompanyTenderService } from './company-participation-company-tender.service';
import { companyParticipationCompanyTenderPaginationConfig } from './config/company-participation-company-tender-pagination-config';
import { UpdateCompanyParticipationCompanyTenderDto } from './dto/update-company-participation-company-tender.dto';

@ApiTags('Company Participation Company Tenders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'company-participation-company-tenders',
  version: '1',
})
export class CompanyParticipationCompanyTenderController {
  constructor(
    private readonly companyParticipationCompanyTenderService: CompanyParticipationCompanyTenderService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCompanyParticipationCompanyTenderDto)
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
          $ref: getSchemaPath(CreateCompanyParticipationCompanyTenderDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto,
    ),
  )
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  @Post('tenders/:tenderId/companies/:companyId')
  async create(
    @Request() request: AuthRequest,
    @Param('tenderId') tenderId: string,
    @Param('companyId') companyId: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyParticipationCompanyTenderEntity> {
    const createTenderParticipationDto =
      new CreateCompanyParticipationCompanyTenderDto(data);
    await Utils.validateDtoOrFail(createTenderParticipationDto);
    return await this.companyParticipationCompanyTenderService.create(
      request.user,
      tenderId,
      companyId,
      createTenderParticipationDto,
      files,
    );
  }

  @ApiPaginationQuery(companyParticipationCompanyTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedDto<
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto
    >
  > {
    const tenders =
      await this.companyParticipationCompanyTenderService.findAll(query);
    return new PaginatedDto<
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto
    >(
      this.mapper,
      tenders,
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto,
    );
  }

  @ApiPaginationQuery(companyParticipationCompanyTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request: AuthRequest,
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedDto<
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto
    >
  > {
    const tenders =
      await this.companyParticipationCompanyTenderService.findAllMe(
        request.user,
        query,
      );
    return new PaginatedDto<
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto
    >(
      this.mapper,
      tenders,
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(
    MapInterceptor(
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto,
    ),
  )
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CompanyParticipationCompanyTenderEntity>> {
    return await this.companyParticipationCompanyTenderService.findOne({ id });
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Put('accept/:id')
  async approve(@Param('id') id: string) {
    return await this.companyParticipationCompanyTenderService.approve(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateCompanyParticipationCompanyTenderDto)
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
          $ref: getSchemaPath(UpdateCompanyParticipationCompanyTenderDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(
      CompanyParticipationCompanyTenderEntity,
      CompanyParticipationCompanyTenderDto,
    ),
  )
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyParticipationCompanyTenderEntity> {
    const updateTenderDto = new UpdateCompanyParticipationCompanyTenderDto(
      data,
    );
    await Utils.validateDtoOrFail(updateTenderDto);
    return this.companyParticipationCompanyTenderService.update(
      id,
      updateTenderDto,
      files,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.companyParticipationCompanyTenderService.remove(id);
  }
}
