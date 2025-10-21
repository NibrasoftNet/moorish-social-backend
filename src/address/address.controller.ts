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
  UseInterceptors,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { AddressEntity } from './entities/address.entity';
import { Mapper } from '@automapper/core';
import { AddressDto } from './dto/address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';

@ApiTags('Address')
@Controller({ path: 'address', version: '1' })
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(AddressEntity, AddressDto))
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressEntity> {
    return await this.addressService.create(createAddressDto);
  }

  @UseInterceptors(MapInterceptor(AddressEntity, AddressDto, { isArray: true }))
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<AddressEntity[]> {
    return await this.addressService.findAll();
  }

  @UseInterceptors(MapInterceptor(AddressEntity, AddressDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<AddressEntity>> {
    return await this.addressService.findOne({ id });
  }

  @UseInterceptors(MapInterceptor(AddressEntity, AddressDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<AddressEntity> {
    return await this.addressService.update(id, updateAddressDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.addressService.remove(id);
  }
}
