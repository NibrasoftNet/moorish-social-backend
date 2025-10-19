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
import { MapInterceptor } from '@automapper/nestjs';
import { NullableType } from '../utils/types/nullable.type';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { DeleteResult } from 'typeorm';
import { TenderCategoryService } from './tender-category.service';
import { TenderCategoryEntity } from './entities/tender-category.entity';
import { TenderCategoryDto } from './dto/tender-category.dto';
import { CreateTenderCategoryDto } from './dto/create-tender-category.dto';
import { UpdateTenderCategoryDto } from './dto/update-tender-category.dto';

@ApiTags('Tender Categories')
@ApiBearerAuth()
@Controller({ version: '1', path: 'tender-categories' })
export class TenderCategoryController {
  constructor(private readonly tenderCategoryService: TenderCategoryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(TenderCategoryEntity, TenderCategoryDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createTenderCategoryDto: CreateTenderCategoryDto,
  ): Promise<TenderCategoryEntity> {
    return await this.tenderCategoryService.create(createTenderCategoryDto);
  }

  @UseInterceptors(
    MapInterceptor(TenderCategoryEntity, TenderCategoryDto, { isArray: true }),
  )
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<TenderCategoryEntity[]> {
    return await this.tenderCategoryService.findAll();
  }

  @UseInterceptors(MapInterceptor(TenderCategoryEntity, TenderCategoryDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<TenderCategoryEntity>> {
    return await this.tenderCategoryService.findOne({ id });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(TenderCategoryEntity, TenderCategoryDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTenderCategoryDto: UpdateTenderCategoryDto,
  ): Promise<TenderCategoryEntity> {
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
