import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { paginate, Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { userTestimonialPaginationConfig } from './config/user-testimonial-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { UserTestimonialEntity } from './entities/user-testimonial.entity';
import { CreateUserTestimonialDto } from './dto/create-user-testimonial.dto';
import { UpdateUserTestimonialDto } from './dto/update-user-testimonial.dto';

@Injectable()
export class UserTestimonialService {
  constructor(
    @InjectRepository(UserTestimonialEntity)
    private readonly testimonialRepository: Repository<UserTestimonialEntity>,
    private readonly usersService: UsersService,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    createTestimonialDto: CreateUserTestimonialDto,
  ): Promise<UserTestimonialEntity> {
    const testimonial = this.testimonialRepository.create(
      createTestimonialDto as DeepPartial<UserTestimonialEntity>,
    );
    testimonial.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    return this.testimonialRepository.save(testimonial);
  }

  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<UserTestimonialEntity>> {
    return await paginate(
      query,
      this.testimonialRepository,
      userTestimonialPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<UserTestimonialEntity>,
    relations?: FindOptionsRelations<UserTestimonialEntity>,
  ): Promise<NullableType<UserTestimonialEntity>> {
    return await this.testimonialRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<UserTestimonialEntity>,
    relations?: FindOptionsRelations<UserTestimonialEntity>,
  ): Promise<UserTestimonialEntity> {
    return await this.testimonialRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTestimonialDto: UpdateUserTestimonialDto,
  ): Promise<UserTestimonialEntity> {
    const testimonial = await this.findOneOrFail({ id });
    Object.assign(testimonial, updateTestimonialDto);
    return this.testimonialRepository.save(testimonial);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.testimonialRepository.delete(id);
  }
}
