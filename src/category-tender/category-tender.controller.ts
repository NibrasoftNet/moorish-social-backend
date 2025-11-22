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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MapInterceptor } from '@automapper/nestjs';
import { NullableType } from '../utils/types/nullable.type';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { DeleteResult } from 'typeorm';
import { CategoryTenderService } from './category-tender.service';
import { CategoryTenderEntity } from './entities/category-tender.entity';
import {
  ApiCategoryTenderDto,
  CategoryTenderDto,
} from './dto/category-tender.dto';
import { CreateCategoryTenderDto } from './dto/create-category-tender.dto';
import { UpdateCategoryTenderDto } from './dto/update-category-tender.dto';

@ApiTags('Categories Tender')
@ApiBearerAuth()
@Controller({ version: '1', path: 'categories-tender' })
export class CategoryTenderController {
  constructor(private readonly tenderCategoryService: CategoryTenderService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CategoryTenderEntity, CategoryTenderDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createTenderCategoryDto: CreateCategoryTenderDto,
  ): Promise<CategoryTenderEntity> {
    return await this.tenderCategoryService.create(createTenderCategoryDto);
  }

  @ApiOkResponse({
    type: ApiCategoryTenderDto,
    description: 'List of tender categories',
  })
  @UseInterceptors(
    MapInterceptor(CategoryTenderEntity, CategoryTenderDto, { isArray: true }),
  )
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<CategoryTenderEntity[]> {
    return await this.tenderCategoryService.findAll();
  }

  @UseInterceptors(MapInterceptor(CategoryTenderEntity, CategoryTenderDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<CategoryTenderEntity>> {
    return await this.tenderCategoryService.findOne({ id });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(CategoryTenderEntity, CategoryTenderDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTenderCategoryDto: UpdateCategoryTenderDto,
  ): Promise<CategoryTenderEntity> {
    return await this.tenderCategoryService.update(id, updateTenderCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.tenderCategoryService.remove(id);
  }
}
