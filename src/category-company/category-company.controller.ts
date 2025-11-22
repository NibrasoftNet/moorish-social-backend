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
import { CategoryCompanyService } from './category-company.service';
import { CreateCategoryCompanyDto } from './dto/create-category-company.dto';
import { UpdateCategoryCompanyDto } from './dto/update-category-company.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { categoryCompanyPaginationConfig } from './config/category-company-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  ApiCategoryCompanyDto,
  CategoryCompanyDto,
} from './dto/category-company.dto';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CategoryCompanyEntity } from './entities/category-company.entity';

@ApiBearerAuth()
@ApiTags('Categories Company')
@Controller({
  path: 'categories-company',
  version: '1',
})
export class CategoryCompanyController {
  constructor(
    private readonly companyCategoryService: CategoryCompanyService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  //@Roles(RoleCodeEnum.SUPERADMIN)
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CategoryCompanyEntity, CategoryCompanyDto))
  @HttpCode(HttpStatus.CREATED)
  @Post('/main-category')
  async createMainCategory(
    @Body() createCompanyCategoryDto: CreateCategoryCompanyDto,
  ): Promise<CategoryCompanyEntity> {
    return await this.companyCategoryService.createCategory(
      createCompanyCategoryDto,
    );
  }

  //@Roles(RoleCodeEnum.SUPERADMIN)
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CategoryCompanyEntity, CategoryCompanyDto))
  @HttpCode(HttpStatus.CREATED)
  @Post('sub-category/:parentId')
  async createSubCategory(
    @Body() createCompanyCategoryDto: CreateCategoryCompanyDto,
    @Param('parentId') parentId: string,
  ): Promise<CategoryCompanyEntity> {
    return await this.companyCategoryService.createCategory(
      createCompanyCategoryDto,
      parentId,
    );
  }

  @ApiPaginationQuery(categoryCompanyPaginationConfig)
  @HttpCode(HttpStatus.OK)
  @Get('list/parents')
  async findAllParent(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CategoryCompanyEntity, CategoryCompanyDto>> {
    const categories = await this.companyCategoryService.findAllParents(query);
    return new PaginatedDto<CategoryCompanyEntity, CategoryCompanyDto>(
      this.mapper,
      categories,
      CategoryCompanyEntity,
      CategoryCompanyDto,
    );
  }

  @ApiPaginationQuery(categoryCompanyPaginationConfig)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CategoryCompanyEntity, CategoryCompanyDto>> {
    const categories =
      await this.companyCategoryService.findAllPaginated(query);
    return new PaginatedDto<CategoryCompanyEntity, CategoryCompanyDto>(
      this.mapper,
      categories,
      CategoryCompanyEntity,
      CategoryCompanyDto,
    );
  }

  @ApiOkResponse({
    type: ApiCategoryCompanyDto,
    description: 'List of all company sub category',
  })
  @UseInterceptors(
    MapInterceptor(CategoryCompanyEntity, CategoryCompanyDto, {
      isArray: true,
    }),
  )
  @HttpCode(HttpStatus.OK)
  @Get('list/children')
  async findAllListed(): Promise<CategoryCompanyEntity[]> {
    return await this.companyCategoryService.findAllChildren();
  }
  /**
   * Get a category by ID
   * @returns {Promise<CategoryCompanyEntity>} retrieved category or undefined if not found
   * @param id
   */
  @UseInterceptors(MapInterceptor(CategoryCompanyEntity, CategoryCompanyDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CategoryCompanyEntity>> {
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
  @UseInterceptors(MapInterceptor(CategoryCompanyEntity, CategoryCompanyDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryCompanyDto,
  ): Promise<CategoryCompanyEntity> {
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
