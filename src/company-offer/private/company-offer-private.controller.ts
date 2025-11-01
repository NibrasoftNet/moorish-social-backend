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
import { CreateCompanyOfferDto } from '../dto/create-company-offer.dto';
import { UpdateCompanyOfferDto } from '../dto/update-company-offer.dto';
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
import { CompanyOfferEntity } from '../entities/company-offer.entity';
import { CompanyOfferDto } from '../dto/company-offer.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../../utils/pipes/parse-formdata.pipe';
import { Utils } from '../../utils/utils';
import { AuthRequest } from '../../utils/types/auth-request.type';
import { DeleteResult } from 'typeorm';
import { CompanyOfferPrivateService } from './company-offer-private.service';

@ApiTags('Company Offers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'company-offers',
  version: '1',
})
export class CompanyOfferPrivateController {
  constructor(
    private readonly companyOfferService: CompanyOfferPrivateService,
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
    const createCompanyOfferDto = await Utils.validateDtoOrFail(
      CreateCompanyOfferDto,
      data,
    );
    return this.companyOfferService.create(
      request.user,
      companyId,
      categoryId,
      createCompanyOfferDto,
      files,
    );
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
    const updateCompanyOfferDto = await Utils.validateDtoOrFail(
      UpdateCompanyOfferDto,
      data,
    );
    return this.companyOfferService.update(id, updateCompanyOfferDto, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.companyOfferService.remove(id);
  }
}
