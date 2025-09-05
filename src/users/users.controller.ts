import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { UserEntity } from './entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateResult } from 'typeorm';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { usersPaginationConfig } from './config/users-pagination.config';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { UserDto } from './user/user.dto';
import { CreateUserDto } from './user/create-user.dto';
import { UpdateUserDto } from './user/update-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MapInterceptor(UserEntity, UserDto))
  async create(@Body() createProfileDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.create(createProfileDto);
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER)
  @Get()
  @HttpCode(HttpStatus.OK)
  @PaginatedSwaggerDocs(UserDto, usersPaginationConfig)
  async findAllPaginated(@Paginate() query: PaginateQuery) {
    const users = await this.usersService.findManyWithPagination(query);
    return new PaginatedDto<UserEntity, UserDto>(
      this.mapper,
      users,
      UserEntity,
      UserDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.SUPERADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(UserEntity, UserDto))
  async findOne(@Param('id') id: string): Promise<NullableType<UserEntity>> {
    return await this.usersService.findOne({ id });
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(UserEntity, UserDto))
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.usersService.update(id, updateProfileDto);
  }

  @Roles(RoleCodeEnum.USER)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<UpdateResult> {
    return await this.usersService.softDelete(id);
  }
}
