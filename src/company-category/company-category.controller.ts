import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyCategoryService } from './company-category.service';
import { CreateCompanyCategoryDto } from '@/domains/company-category/create-company-category.dto';
import { UpdateCompanyCategoryDto } from '@/domains/company-category/update-company-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { companyCategoryPaginationConfig } from './config/company-category-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { CompanyCategoryDto } from '@/domains/company-category/company-category.dto';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CompanyCategoryEntity } from './entities/company-category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Utils } from '../utils/utils';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';

@ApiBearerAuth()
@ApiTags('Company Categories')
@Controller({
  path: 'company-categories',
  version: '1',
})
export class CompanyCategoryController {
  constructor(
    private readonly companyCategoryService: CompanyCategoryService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCompanyCategoryDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(CreateCompanyCategoryDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CompanyCategoryEntity, CompanyCategoryDto))
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @Post('/main-category')
  async createMainCategory(
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyCategoryEntity> {
    const createCompanyCategoryDto = new CreateCompanyCategoryDto(data);
    await Utils.validateDtoOrFail(createCompanyCategoryDto);
    return await this.companyCategoryService.createCategory(
      createCompanyCategoryDto,
      file,
    );
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCompanyCategoryDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(CreateCompanyCategoryDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CompanyCategoryEntity, CompanyCategoryDto))
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @Post('sub-category/:parentId')
  async createSubCategory(
    @Param('parentId') parentId: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyCategoryEntity> {
    const createCompanyCategoryDto = new CreateCompanyCategoryDto(data);
    await Utils.validateDtoOrFail(createCompanyCategoryDto);
    return await this.companyCategoryService.createCategory(
      createCompanyCategoryDto,
      file,
      parentId,
    );
  }

  @ApiPaginationQuery(companyCategoryPaginationConfig)
  @HttpCode(HttpStatus.OK)
  @Get('parents')
  async findAllParent(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CompanyCategoryEntity, CompanyCategoryDto>> {
    const categories = await this.companyCategoryService.findAllParents(query);
    return new PaginatedDto<CompanyCategoryEntity, CompanyCategoryDto>(
      this.mapper,
      categories,
      CompanyCategoryEntity,
      CompanyCategoryDto,
    );
  }

  @ApiPaginationQuery(companyCategoryPaginationConfig)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CompanyCategoryEntity, CompanyCategoryDto>> {
    const categories =
      await this.companyCategoryService.findAllPaginated(query);
    return new PaginatedDto<CompanyCategoryEntity, CompanyCategoryDto>(
      this.mapper,
      categories,
      CompanyCategoryEntity,
      CompanyCategoryDto,
    );
  }

  /**
   * Get a category by ID
   * @returns {Promise<CompanyCategoryEntity>} retrieved category or undefined if not found
   * @param id
   */
  @UseInterceptors(MapInterceptor(CompanyCategoryEntity, CompanyCategoryDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CompanyCategoryEntity>> {
    return await this.companyCategoryService.findOne(
      { id: id },
      { parent: true, children: true, image: true },
    );
  }

  /**
   * Update a category
   * @param id {number} category ID
   * @param data
   * @param file
   * @returns {Promise<void>} updated category or undefined if not found
   */
  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateCompanyCategoryDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(UpdateCompanyCategoryDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CompanyCategoryEntity, CompanyCategoryDto))
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<CompanyCategoryEntity> {
    const updateCategoryDto = new UpdateCompanyCategoryDto(data);
    return await this.companyCategoryService.update(
      id,
      updateCategoryDto,
      file,
    );
  }

  /**
   * Delete a category by ID
   * @param id {number} category ID
   * @returns {Promise<DeleteResult>} deletion result
   */
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.companyCategoryService.remove(id);
  }
}
