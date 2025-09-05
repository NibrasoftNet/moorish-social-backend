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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyCategoryService } from './company-category.service';
import { CreateCompanyCategoryDto } from './dto/create-company-category.dto';
import { UpdateCompanyCategoryDto } from './dto/update-company-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { companyCategoryPaginationConfig } from './config/company-category-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { CompanyCategoryDto } from './dto/company-category.dto';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CompanyCategoryEntity } from './entities/company-category.entity';

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

  //@Roles(RoleCodeEnum.SUPERADMIN)
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CompanyCategoryEntity, CompanyCategoryDto))
  @HttpCode(HttpStatus.CREATED)
  @Post('/main-category')
  async createMainCategory(
    @Body() createCompanyCategoryDto: CreateCompanyCategoryDto,
  ): Promise<CompanyCategoryEntity> {
    return await this.companyCategoryService.createCategory(
      createCompanyCategoryDto,
    );
  }

  //@Roles(RoleCodeEnum.SUPERADMIN)
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CompanyCategoryEntity, CompanyCategoryDto))
  @HttpCode(HttpStatus.CREATED)
  @Post('sub-category/:parentId')
  async createSubCategory(
    @Body() createCompanyCategoryDto: CreateCompanyCategoryDto,
    @Param('parentId') parentId: string,
  ): Promise<CompanyCategoryEntity> {
    return await this.companyCategoryService.createCategory(
      createCompanyCategoryDto,
      parentId,
    );
  }

  @ApiPaginationQuery(companyCategoryPaginationConfig)
  @HttpCode(HttpStatus.OK)
  @Get('list/parents')
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

  @UseInterceptors(
    MapInterceptor(CompanyCategoryEntity, CompanyCategoryDto, {
      isArray: true,
    }),
  )
  @HttpCode(HttpStatus.OK)
  @Get('list/children')
  async findAllListed(): Promise<CompanyCategoryEntity[]> {
    return await this.companyCategoryService.findAllChildren();
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
      { parent: true, children: true },
    );
  }

  /**
   * Update a category
   * @param id {number} category ID
   * @param updateCategoryDto
   * @returns {Promise<void>} updated category or undefined if not found
   */
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CompanyCategoryEntity, CompanyCategoryDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCompanyCategoryDto,
  ): Promise<CompanyCategoryEntity> {
    return await this.companyCategoryService.update(id, updateCategoryDto);
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
