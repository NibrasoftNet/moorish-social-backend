import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { Mapper } from '@automapper/core';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { NullableType } from '../utils/types/nullable.type';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { DeleteResult } from 'typeorm';
import { CategoryTokenService } from './category-token.service';
import { CategoryTokenEntity } from './entities/category-token.entity';
import { CategoryTokenDto } from './dto/category-token.dto';
import { CreateCategoryTokenDto } from './dto/create-category-token.dto';
import { UpdateCategoryTokenDto } from './dto/update-category-token.dto';
import { categoryTokenPaginationConfig } from './config/category-token-pagination-config';

@ApiTags('Categories Token')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'categories-token' })
export class CategoryTokenController {
  constructor(
    private readonly tokenCategoryService: CategoryTokenService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(CategoryTokenEntity, CategoryTokenDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createTokenCategoryDto: CreateCategoryTokenDto,
  ): Promise<CategoryTokenEntity> {
    return await this.tokenCategoryService.create(createTokenCategoryDto);
  }

  @ApiPaginationQuery(categoryTokenPaginationConfig)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<CategoryTokenEntity, CategoryTokenDto>> {
    const categories = await this.tokenCategoryService.findAll(query);
    return new PaginatedDto<CategoryTokenEntity, CategoryTokenDto>(
      this.mapper,
      categories,
      CategoryTokenEntity,
      CategoryTokenDto,
    );
  }

  @UseInterceptors(MapInterceptor(CategoryTokenEntity, CategoryTokenDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CategoryTokenEntity>> {
    return await this.tokenCategoryService.findOne({ id });
  }

  @UseInterceptors(MapInterceptor(CategoryTokenEntity, CategoryTokenDto))
  @Roles(RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTokenCategoryDto: UpdateCategoryTokenDto,
  ): Promise<CategoryTokenEntity> {
    return await this.tokenCategoryService.update(id, updateTokenCategoryDto);
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.tokenCategoryService.remove(id);
  }
}
