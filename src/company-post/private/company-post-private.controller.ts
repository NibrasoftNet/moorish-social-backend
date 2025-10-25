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
} from '@nestjs/common';
import { CreateCompanyPostDto } from '../dto/create-company-post.dto';
import { UpdateCompanyPostDto } from '../dto/update-company-post.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
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
import { CompanyPostDto } from '../dto/company-post.dto';
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
    const createCompanyPostDto = new CreateCompanyPostDto(data);
    await Utils.validateDtoOrFail(createCompanyPostDto);
    return this.companyPostService.create(
      request.user,
      companyId,
      categoryId,
      createCompanyPostDto,
      files,
    );
  }

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
  @Roles(RoleCodeEnum.TENANTADMIN)
  @UseInterceptors(MapInterceptor(CompanyPostEntity, CompanyPostDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CompanyPostEntity> {
    const updateCompanyPostDto = new UpdateCompanyPostDto(data);
    await Utils.validateDtoOrFail(updateCompanyPostDto);
    return this.companyPostService.update(id, updateCompanyPostDto, files);
  }

  @Roles(RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.companyPostService.remove(id);
  }
}
