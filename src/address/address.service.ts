import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { AddressEntity } from './entities/address.entity';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async create(payload: DeepPartial<AddressEntity>): Promise<AddressEntity> {
    const address = this.addressRepository.create(payload);
    return await this.addressRepository.save(address);
  }

  async findAll(
    fields?: FindOptionsWhere<AddressEntity>,
  ): Promise<AddressEntity[]> {
    return await this.addressRepository.find({ where: fields });
  }

  async findOne(
    fields: FindOptionsWhere<AddressEntity>,
  ): Promise<NullableType<AddressEntity>> {
    return await this.addressRepository.findOne({
      where: fields,
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<AddressEntity>,
  ): Promise<AddressEntity> {
    return await this.addressRepository.findOneOrFail({
      where: fields,
    });
  }

  async update(
    id: string,
    payload: DeepPartial<AddressEntity>,
  ): Promise<AddressEntity> {
    const address = await this.findOneOrFail({ id });
    Object.assign(address, payload);
    return await this.addressRepository.save(address);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.addressRepository.delete(id);
  }
}
