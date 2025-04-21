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
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { UserTenderService } from './user-tender.service';
import { CreateUserTenderDto } from '@/domains/user-tender/create-user-tender.dto';
import { UpdateUserTenderDto } from '@/domains/user-tender/update-user-tender.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserTenderEntity } from './entities/user-tender.entity';
import { UserTenderDto } from '@/domains/user-tender/user-tender.dto';
import { AuthRequest } from '../utils/types/auth-request.type';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { userTenderPaginationConfig } from './config/user-tender-pagination.config';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Utils } from '../utils/utils';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';

@ApiTags('User Tenders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'user-tenders',
  version: '1',
})
export class UserTenderController {
  constructor(
    private readonly userTenderService: UserTenderService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateUserTenderDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(CreateUserTenderDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(UserTenderEntity, UserTenderDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  @Post('categories/:categoryId')
  async create(
    @Request() request: AuthRequest,
    @Param('categoryId') categoryId: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<UserTenderEntity> {
    const createTenderDto = new CreateUserTenderDto(data);
    await Utils.validateDtoOrFail(createTenderDto);
    return await this.userTenderService.create(
      request.user,
      categoryId,
      createTenderDto,
      files,
    );
  }

  @ApiPaginationQuery(userTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<UserTenderEntity, UserTenderDto>> {
    const tenders = await this.userTenderService.findAll(query);
    return new PaginatedDto<UserTenderEntity, UserTenderDto>(
      this.mapper,
      tenders,
      UserTenderEntity,
      UserTenderDto,
    );
  }

  @ApiPaginationQuery(userTenderPaginationConfig)
  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request: AuthRequest,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<UserTenderEntity, UserTenderDto>> {
    const tenders = await this.userTenderService.findAllMe(request.user, query);
    return new PaginatedDto<UserTenderEntity, UserTenderDto>(
      this.mapper,
      tenders,
      UserTenderEntity,
      UserTenderDto,
    );
  }

  @Roles(RoleCodeEnum.TENANTADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(UserTenderEntity, UserTenderDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<UserTenderEntity>> {
    return await this.userTenderService.findOne({ id });
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateUserTenderDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(UpdateUserTenderDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(UserTenderEntity, UserTenderDto))
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<UserTenderEntity> {
    const updateTenderDto = new UpdateUserTenderDto(data);
    await Utils.validateDtoOrFail(updateTenderDto);
    return this.userTenderService.update(id, updateTenderDto, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.userTenderService.remove(id);
  }
}
