import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../users/entities/user.entity';
import { Role } from '../../../roles/entities/role.entity';
import { Status } from '../../../statuses/entities/status.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { AddressFactory } from '../address/address.factory';
import { AddressEntity } from '../../../address/entities/address.entity';
import { RoleCodeEnum } from '@/enums/roles.enum';
import { StatusCodeEnum } from '@/enums/statuses.enum';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(UserEntity)
    private repositoryUser: Repository<UserEntity>,
    @InjectRepository(Role)
    private repositoryRole: Repository<Role>,
    @InjectRepository(Status)
    private repositoryStatus: Repository<Status>,
    @InjectRepository(AddressEntity)
    private repositoryAddress: Repository<AddressEntity>,
    private addressFactory: AddressFactory,
  ) {}

  createRandomUser() {
    // Need for saving "this" context

    const activeStatus = {
      id: StatusCodeEnum.ACTIVE,
      name: 'ACTIVE',
      code: StatusCodeEnum.ACTIVE,
    } as Status;
    const inactiveStatus = {
      id: StatusCodeEnum.INACTIVE,
      name: 'INACTIVE',
      code: StatusCodeEnum.INACTIVE,
    } as Status;
    const userRole = {
      id: RoleCodeEnum.USER,
      name: 'USER',
      code: RoleCodeEnum.USER,
    } as Role;
    const adminRole = {
      id: RoleCodeEnum.TENANTADMIN,
      name: 'ADMIN',
      code: RoleCodeEnum.TENANTADMIN,
    } as Role;
    return {
      userName: faker.person.firstName(),
      email: faker.internet.email().toLowerCase(),
      password: 'H@mza12345',
      role: faker.helpers.arrayElement<Role>([userRole, adminRole]),
      status: faker.helpers.arrayElement<Status>([
        activeStatus,
        inactiveStatus,
      ]),
      address: this.addressFactory.generateRandom(),
    } as UserEntity;
  }
}
