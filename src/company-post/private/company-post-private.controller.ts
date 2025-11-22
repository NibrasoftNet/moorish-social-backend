import {
  Controller,
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
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateCompanyPostDto } from '../dto/create-company-post.dto';
import { UpdateCompanyPostDto } from '../dto/update-company-post.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../roles/roles.guard';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Roles } from '../../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CompanyPostEntity } from '../entities/company-post.entity';
import { ApiCompanyPostDto, CompanyPostDto } from '../dto/company-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../../utils/pipes/parse-formdata.pipe';
import { Utils } from '../../utils/utils';
import { AuthRequest } from '../../utils/types/auth-request.type';
import { DeleteResult } from 'typeorm';
import { CompanyPostPrivateService } from './company-post-private.service';

@ApiTags('Company Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'company-posts',
  version: '1',
})
export class CompanyPostPrivateController {
  constructor(
    private readonly companyPostService: CompanyPostPrivateService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCompanyPostDto)
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
          $ref: getSchemaPath(CreateCompanyPostDto),
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Create new post comapny',
    type: ApiCompanyPostDto,
  })
  @Roles(RoleCodeEnum.TENANTADMIN)
  @UseInterceptors(MapInterceptor(CompanyPostEntity, CompanyPostDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  @Post('companies/:companyId/categories/:categoryId')
  async create(
    @Request() request: AuthRequest,
    @Param('companyId') companyId: string,
    @Param('categoryId') categoryId: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyPostEntity> {
    const createCompanyPostDto = await Utils.validateDtoOrFail(
      CreateCompanyPostDto,
      data,
    );
    return this.companyPostService.create(
      request.user,
      companyId,
      categoryId,
      createCompanyPostDto,
      files,
    );
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateCompanyPostDto)
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
          $ref: getSchemaPath(UpdateCompanyPostDto),
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Update post company by ID',
    type: ApiCompanyPostDto,
  })
  @Roles(RoleCodeEnum.TENANTADMIN)
  @UseInterceptors(MapInterceptor(CompanyPostEntity, CompanyPostDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyPostEntity> {
    const updateCompanyPostDto = await Utils.validateDtoOrFail(
      UpdateCompanyPostDto,
      data,
    );
    return this.companyPostService.update(id, updateCompanyPostDto, files);
  }

  @Roles(RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.companyPostService.remove(id);
  }
}
