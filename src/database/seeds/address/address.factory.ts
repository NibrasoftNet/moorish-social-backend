import { Injectable } from '@nestjs/common';
import { AddressEntity } from '../../../address/entities/address.entity';
import { fakerFR } from '@faker-js/faker';

@Injectable()
export class AddressFactory {
  generateRandom(): AddressEntity {
    return {
      country: 'Tunisia',
      city: fakerFR.location.county(),
      longitude: fakerFR.location.longitude(),
      latitude: fakerFR.location.latitude(),
      street: fakerFR.location.street(),
    } as AddressEntity;
  }
}
