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
import { Mapper } from 'automapper-core';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { NullableType } from '../utils/types/nullable.type';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { DeleteResult } from 'typeorm';
import { TokenCategoryService } from './token-category.service';
import { TokenCategoryEntity } from './entities/token-category.entity';
import { TokenCategoryDto } from './dto/token-category.dto';
import { CreateTokenCategoryDto } from './dto/create-token-category.dto';
import { UpdateTokenCategoryDto } from './dto/update-token-category.dto';
import { tokenCategoryPaginationConfig } from './config/token-category-pagination-config';

@ApiTags('Token Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'token-categories' })
export class TokenCategoryController {
  constructor(
    private readonly tokenCategoryService: TokenCategoryService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(TokenCategoryEntity, TokenCategoryDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createTokenCategoryDto: CreateTokenCategoryDto,
  ): Promise<TokenCategoryEntity> {
    return await this.tokenCategoryService.create(createTokenCategoryDto);
  }

  @ApiPaginationQuery(tokenCategoryPaginationConfig)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<TokenCategoryEntity, TokenCategoryDto>> {
    const categories = await this.tokenCategoryService.findAll(query);
    return new PaginatedDto<TokenCategoryEntity, TokenCategoryDto>(
      this.mapper,
      categories,
      TokenCategoryEntity,
      TokenCategoryDto,
    );
  }

  @UseInterceptors(MapInterceptor(TokenCategoryEntity, TokenCategoryDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<TokenCategoryEntity>> {
    return await this.tokenCategoryService.findOne({ id });
  }

  @UseInterceptors(MapInterceptor(TokenCategoryEntity, TokenCategoryDto))
  @Roles(RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTokenCategoryDto: UpdateTokenCategoryDto,
  ): Promise<TokenCategoryEntity> {
    return await this.tokenCategoryService.update(id, updateTokenCategoryDto);
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.tokenCategoryService.remove(id);
  }
}
