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
import { PostCategoryService } from './post-category.service';
import { PostCategoryEntity } from './entities/post-category.entity';
import { ApiPostCategoryDto, PostCategoryDto } from './dto/post-category.dto';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';

@ApiTags('Post Categories')
@ApiBearerAuth()
@Controller({
  path: 'post-categories',
  version: '1',
})
export class PostCategoryController {
  constructor(private readonly companyCategoryService: PostCategoryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(PostCategoryEntity, PostCategoryDto))
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createMainCategory(
    createPostCategoryDto: CreatePostCategoryDto,
  ): Promise<PostCategoryEntity> {
    return await this.companyCategoryService.createCategory(
      createPostCategoryDto,
    );
  }

  @ApiOkResponse({
    type: ApiPostCategoryDto,
    description: 'List of posts categories',
  })
  @UseInterceptors(
    MapInterceptor(PostCategoryEntity, PostCategoryDto, { isArray: true }),
  )
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<PostCategoryEntity[]> {
    return await this.companyCategoryService.findAll();
  }

  /**
   * Get a category by ID
   * @returns {Promise<PostCategoryEntity>} retrieved category or undefined if not found
   * @param id
   */
  @UseInterceptors(MapInterceptor(PostCategoryEntity, PostCategoryDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<PostCategoryEntity>> {
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
  @UseInterceptors(MapInterceptor(PostCategoryEntity, PostCategoryDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostCategoryDto: UpdatePostCategoryDto,
  ): Promise<PostCategoryEntity> {
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
