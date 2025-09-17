import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserTenantEntity } from './entities/user-tenant.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { FilesService } from '../files/files.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { NullableType } from '../utils/types/nullable.type';
import { CreateUserTenantDto } from './dto/create-user-tenant.dto';
import { usersTenantPaginationConfig } from './config/users-tenant-pagination.config';
import { plainToClass } from 'class-transformer';
import { Status } from '../statuses/entities/status.entity';
import { StatusCodeEnum } from '@/enums/statuses.enum';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { Role } from '../roles/entities/role.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { nanoid } from 'nanoid';
import { AuthTenantUpdateDto } from '../auth/dto/tenant/auth-tenant-update.dto';

@Injectable()
export class UsersTenantService {
  constructor(
    @InjectRepository(UserTenantEntity)
    private usersTenantRepository: Repository<UserTenantEntity>,
    private fileService: FilesService,
    private readonly logger: WinstonLoggerService,
  ) {}
  async create(
    createProfileDto: CreateUserTenantDto,
  ): Promise<UserTenantEntity> {
    const admin = this.usersTenantRepository.create(createProfileDto);
    admin.status = plainToClass(Status, {
      id: StatusCodeEnum.ACTIVE,
      code: StatusCodeEnum.ACTIVE,
    });

    admin.role = plainToClass(Role, {
      id: RoleCodeEnum.TENANTADMIN,
      code: RoleCodeEnum.TENANTADMIN,
    });

    admin.tenantId = nanoid();

    return await this.usersTenantRepository.save(admin);
  }

  async findManyWithPagination(
    query: PaginateQuery,
  ): Promise<Paginated<UserTenantEntity>> {
    return await paginate(
      query,
      this.usersTenantRepository,
      usersTenantPaginationConfig,
    );
  }

  async findOne(
    fields: FindOptionsWhere<UserTenantEntity>,
    relations?: FindOptionsRelations<UserTenantEntity>,
  ): Promise<NullableType<UserTenantEntity>> {
    return await this.usersTenantRepository.findOne({
      where: fields,
      relations,
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<UserTenantEntity>,
    relations?: FindOptionsRelations<UserTenantEntity>,
  ): Promise<UserTenantEntity> {
    return this.usersTenantRepository.findOneOrFail({
      where: fields,
      relations,
    });
  }

  async update(
    id: string,
    updateUserDto: AuthTenantUpdateDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<UserTenantEntity> {
    const user = await this.findOneOrFail({ id });
    Object.assign(user, updateUserDto);
    if (!!file) {
      user.image = user?.image?.id
        ? await this.fileService.updateFile(user?.image?.id, file)
        : await this.fileService.uploadFile(file);
    }
    return this.usersTenantRepository.save(user);
  }

  async softDelete(id: UserTenantEntity['id']): Promise<UpdateResult> {
    return await this.usersTenantRepository.softDelete(id);
  }

  async restoreUserByEmail(
    email: UserTenantEntity['email'],
  ): Promise<UserTenantEntity | null> {
    // Find the user by email, including soft-deleted ones
    const user = await this.usersTenantRepository.findOne({
      withDeleted: true,
      where: { email },
    });

    if (user && user.deletedAt) {
      // If the user is found and is soft-deleted, restore the user
      await this.usersTenantRepository.restore(user.id);
      return user;
    }
    // Return null if no user was found or the user was not deleted
    return null;
  }

  async findAllUsersToken(userIds?: number[]): Promise<string[]> {
    const query = this.usersTenantRepository
      .createQueryBuilder('user')
      .select('user.notificationToken')
      .where('user.notificationToken IS NOT NULL'); // To avoid selecting null values

    // If userIds are provided, filter by user IDs
    if (userIds && userIds.length > 0) {
      query.andWhere('user.id IN (:...userIds)', { userIds });
    }

    const result = await query.getMany();

    // Extract the notification tokens as an array of strings
    return result.map((user) => user.notificationsToken) as string[];
  }

  async findAllUsersByIds(userIds: number[]): Promise<Array<UserTenantEntity>> {
    const stopWatching = this.logger.watch('users-findAllUsersByIds', {
      description: `Find All Users By Ids`,
      class: UsersTenantService.name,
      function: 'findAllUsersToken',
    });

    const queryBuilder = this.usersTenantRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.status', 'status')
      .orWhereInIds(userIds);
    const users = await queryBuilder.getMany();
    stopWatching();
    return users;
  }

  async addCompanyToTenant(
    tenant: UserTenantEntity,
    company: CompanyEntity,
  ): Promise<UserTenantEntity> {
    this.logger.watch('users-addCompanyToTenant', {
      description: `Add company to tenant`,
      class: UsersTenantService.name,
      function: 'addCompanyToTenant',
    });
    tenant.company = company;
    return await this.usersTenantRepository.save(tenant);
  }
}
