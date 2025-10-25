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
import { RolesGuard } from '../../roles/roles.guard';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Roles } from '../../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { ParseFormdataPipe } from '../../utils/pipes/parse-formdata.pipe';
import { Utils } from '../../utils/utils';
import { Mapper } from '@automapper/core';
import { IsCreatorPipe } from '../../utils/pipes/is-creator.pipe';
import { DeleteResult } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { CompanyDto } from '../dto/company.dto';
import { CompanyPrivateService } from './company-private.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { AuthRequest } from '../../utils/types/auth-request.type';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller({ version: '1', path: 'companies' })
export class CompanyPrivateController {
  constructor(
    private readonly companyService: CompanyPrivateService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiHeader({
    name: 'tenant-id',
    required: true,
    description: 'Tenant-Id header',
    schema: { type: 'string' },
  })
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
  @Post()
  async create(
    @Request() request: AuthRequest,
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyEntity> {
    const createCompanyDto = new CreateCompanyDto(data);
    await Utils.validateDtoOrFail(createCompanyDto);
    return await this.companyService.create(
      request.user,
      createCompanyDto,
      file,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiHeader({
    name: 'tenant-id',
    required: true,
    description: 'Tenant-Id header',
    schema: { type: 'string' },
  })
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
    @Body('data', ParseFormdataPipe) data: any,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyEntity> {
    const updateComplexDto = new UpdateCompanyDto(data);
    await Utils.validateDtoOrFail(updateComplexDto);
    return this.companyService.update(id, updateComplexDto, file);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiHeader({
    name: 'tenant-id',
    required: true,
    description: 'Tenant-Id header',
    schema: { type: 'string' },
  })
  @Roles(RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id', IsCreatorPipe('Complex', 'id', 'creator')) id: string,
  ): Promise<DeleteResult> {
    return await this.companyService.remove(id);
  }
}
