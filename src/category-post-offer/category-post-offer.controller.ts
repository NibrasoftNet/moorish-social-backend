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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { MapInterceptor } from '@automapper/nestjs';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CategoryPostOfferService } from './category-post-offer.service';
import { CategoryPostOfferEntity } from './entities/category-post-offer.entity';
import {
  ApiCategoryPostOfferDto,
  CategoryPostOfferDto,
} from './dto/category-post-offer.dto';
import { CreateCategoryPostOfferDto } from './dto/create-category-post-offer.dto';
import { UpdateCategoryPostOfferDto } from './dto/update-category-post-offer.dto';

@ApiTags('Categories post offer')
@ApiBearerAuth()
@Controller({
  path: 'categories-post-offer',
  version: '1',
})
export class CategoryPostOfferController {
  constructor(
    private readonly companyCategoryService: CategoryPostOfferService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(
    MapInterceptor(CategoryPostOfferEntity, CategoryPostOfferDto),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createMainCategory(
    createPostCategoryDto: CreateCategoryPostOfferDto,
  ): Promise<CategoryPostOfferEntity> {
    return await this.companyCategoryService.createCategory(
      createPostCategoryDto,
    );
  }

  @ApiOkResponse({
    type: ApiCategoryPostOfferDto,
    description: 'List of posts categories',
  })
  @UseInterceptors(
    MapInterceptor(CategoryPostOfferEntity, CategoryPostOfferDto, {
      isArray: true,
    }),
  )
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<CategoryPostOfferEntity[]> {
    return await this.companyCategoryService.findAll();
  }

  /**
   * Get a category by ID
   * @returns {Promise<CategoryPostOfferEntity>} retrieved category or undefined if not found
   * @param id
   */
  @UseInterceptors(
    MapInterceptor(CategoryPostOfferEntity, CategoryPostOfferDto),
  )
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CategoryPostOfferEntity>> {
    return await this.companyCategoryService.findOne({ id: id });
  }

  /**
   * Update a category
   * @returns {Promise<void>} updated category or undefined if not found
   * @param id
   * @param updatePostCategoryDto
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(
    MapInterceptor(CategoryPostOfferEntity, CategoryPostOfferDto),
  )
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostCategoryDto: UpdateCategoryPostOfferDto,
  ): Promise<CategoryPostOfferEntity> {
    return await this.companyCategoryService.update(id, updatePostCategoryDto);
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
