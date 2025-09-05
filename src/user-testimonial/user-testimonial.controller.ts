import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Request,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UserTestimonialService } from './user-testimonial.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { userTestimonialPaginationConfig } from './config/user-testimonial-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { NullableType } from '../utils/types/nullable.type';
import { AuthRequest } from '../utils/types/auth-request.type';
import { CreateUserTestimonialDto } from './dto/create-user-testimonial.dto';
import { UserTestimonialEntity } from './entities/user-testimonial.entity';
import { UserTestimonialDto } from './dto/user-testimonial.dto';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { UpdateUserTestimonialDto } from './dto/update-user-testimonial.dto';

@ApiTags('User Testimonials')
@ApiBearerAuth()
@Controller({ version: '1', path: 'user-testimonials' })
export class UserTestimonialController {
  constructor(
    private readonly testimonialsService: UserTestimonialService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(UserTestimonialEntity, UserTestimonialDto))
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() request: AuthRequest,
    @Body() createTestimonialDto: CreateUserTestimonialDto,
  ): Promise<UserTestimonialEntity> {
    return await this.testimonialsService.create(
      request.user,
      createTestimonialDto,
    );
  }

  @ApiPaginationQuery(userTestimonialPaginationConfig)
  @UseInterceptors(
    MapInterceptor(UserTestimonialEntity, UserTestimonialDto, {
      isArray: true,
    }),
  )
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<UserTestimonialEntity, UserTestimonialDto>> {
    const testimonials = await this.testimonialsService.findAll(query);
    return new PaginatedDto<UserTestimonialEntity, UserTestimonialDto>(
      this.mapper,
      testimonials,
      UserTestimonialEntity,
      UserTestimonialDto,
    );
  }

  @UseInterceptors(MapInterceptor(UserTestimonialEntity, UserTestimonialDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<UserTestimonialEntity>> {
    return await this.testimonialsService.findOne({ id });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(UserTestimonialEntity, UserTestimonialDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', IsCreatorPipe('Testimonial', 'id', 'creator')) id: string,
    @Body() updateTestimonialDto: UpdateUserTestimonialDto,
  ): Promise<UserTestimonialEntity> {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.testimonialsService.remove(+id);
  }
}
