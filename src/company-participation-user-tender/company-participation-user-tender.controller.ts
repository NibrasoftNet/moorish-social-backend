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
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
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
import { CreateCompanyParticipationUserTenderDto } from '@/domains/company-participation-user-tender/create-company-participation-user-tender.dto';
import { CompanyParticipationUserTenderEntity } from './entities/company-participation-user-tender.entity';
import { CompanyParticipationUserTenderDto } from '@/domains/company-participation-user-tender/company-participation-user-tender.dto';
import { companyParticipationUserTenderPaginationConfig } from './config/company-particiaption-user-tender-pagination-config';
import { UpdateCompanyParticipationUserTenderDto } from '@/domains/company-participation-user-tender/update-company-participation-user-tender.dto';
import { CompanyParticipationUserTenderService } from './company-participation-user-tender.service';

@ApiTags('Company Participation User Tenders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'company-participation-user-tenders',
  version: '1',
})
export class CompanyParticipationUserTenderController {
  constructor(
    private readonly companyParticipationUserTenderService: CompanyParticipationUserTenderService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCompanyParticipationUserTenderDto)
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
          $ref: getSchemaPath(CreateCompanyParticipationUserTenderDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto,
    ),
  )
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  @Post('tenders/:tenderId/companies/:companyId')
  async create(
    @Request() request: AuthRequest,
    @Param('tenderId') tenderId: string,
    @Param('companyId') companyId: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyParticipationUserTenderEntity> {
    const createTenderParticipationDto =
      new CreateCompanyParticipationUserTenderDto(data);
    await Utils.validateDtoOrFail(createTenderParticipationDto);
    return await this.companyParticipationUserTenderService.create(
      request.user,
      tenderId,
      companyId,
      createTenderParticipationDto,
      files,
    );
  }

  @ApiPaginationQuery(companyParticipationUserTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedDto<
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto
    >
  > {
    const tenders =
      await this.companyParticipationUserTenderService.findAll(query);
    return new PaginatedDto<
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto
    >(
      this.mapper,
      tenders,
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto,
    );
  }

  @ApiPaginationQuery(companyParticipationUserTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request: AuthRequest,
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedDto<
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto
    >
  > {
    const tenders = await this.companyParticipationUserTenderService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto
    >(
      this.mapper,
      tenders,
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(
    MapInterceptor(
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto,
    ),
  )
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CompanyParticipationUserTenderEntity>> {
    return await this.companyParticipationUserTenderService.findOne({ id });
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Put('accept/:id')
  async approve(@Param('id') id: string) {
    return await this.companyParticipationUserTenderService.approve(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateCompanyParticipationUserTenderDto)
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
          $ref: getSchemaPath(UpdateCompanyParticipationUserTenderDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(
      CompanyParticipationUserTenderEntity,
      CompanyParticipationUserTenderDto,
    ),
  )
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyParticipationUserTenderEntity> {
    const updateTenderDto = new UpdateCompanyParticipationUserTenderDto(data);
    await Utils.validateDtoOrFail(updateTenderDto);
    return this.companyParticipationUserTenderService.update(
      id,
      updateTenderDto,
      files,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.companyParticipationUserTenderService.remove(id);
  }
}
