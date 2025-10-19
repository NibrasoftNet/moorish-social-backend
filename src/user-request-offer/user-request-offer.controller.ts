import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Request,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';
import { UserRequestOfferService } from './user-request-offer.service';
import { UserRequestOfferEntity } from './entities/user-request-offer.entity';
import { UserRequestOfferDto } from './dto/user-request-offer.dto';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { CreateUserRequestOfferDto } from './dto/create-user-request-offer.dto';
import { UpdateUserRequestOfferDto } from './dto/update-user-request-offer.dto';
import { AuthRequest } from '../utils/types/auth-request.type';
import { userRequestOfferPaginationConfig } from './config/user-request-offer-pagination-config';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';

@ApiTags('User Request offer')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'matches' })
export class UserRequestOfferController {
  constructor(
    private readonly userRequestOfferService: UserRequestOfferService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(UserRequestOfferEntity, UserRequestOfferDto))
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post('offers/:offerId')
  async create(
    @Request() request: AuthRequest,
    @Param('offerId') offerId: string,
    @Body() createUserRequestOfferDto: CreateUserRequestOfferDto,
  ): Promise<UserRequestOfferEntity> {
    return await this.userRequestOfferService.create(
      request.user,
      offerId,
      createUserRequestOfferDto,
    );
  }

  @ApiPaginationQuery(userRequestOfferPaginationConfig)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.TENANTADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<UserRequestOfferEntity, UserRequestOfferDto>> {
    const matches = await this.userRequestOfferService.findAll(query);
    return new PaginatedDto<UserRequestOfferEntity, UserRequestOfferDto>(
      this.mapper,
      matches,
      UserRequestOfferEntity,
      UserRequestOfferDto,
    );
  }

  @ApiPaginationQuery(userRequestOfferPaginationConfig)
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request: AuthRequest,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<UserRequestOfferEntity, UserRequestOfferDto>> {
    const matches = await this.userRequestOfferService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<UserRequestOfferEntity, UserRequestOfferDto>(
      this.mapper,
      matches,
      UserRequestOfferEntity,
      UserRequestOfferDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(UserRequestOfferEntity, UserRequestOfferDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<UserRequestOfferEntity>> {
    return await this.userRequestOfferService.findOne({ id });
  }

  @Roles(RoleCodeEnum.TENANTADMIN)
  @UseInterceptors(MapInterceptor(UserRequestOfferEntity, UserRequestOfferDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Request() request: AuthRequest,
    @Param('id') id: string,
    @Body() updateUserRequestOfferDto: UpdateUserRequestOfferDto,
  ): Promise<UserRequestOfferEntity> {
    return await this.userRequestOfferService.update(
      request.user,
      id,
      updateUserRequestOfferDto,
    );
  }

  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id', IsCreatorPipe('UserRequestOfferEntity', 'id', 'creator'))
    id: string,
  ): Promise<DeleteResult> {
    return await this.userRequestOfferService.remove(id);
  }
}
