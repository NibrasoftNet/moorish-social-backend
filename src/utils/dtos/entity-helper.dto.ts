import { AfterLoad, BaseEntity } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class EntityHelperDto extends BaseEntity {
  @Exclude()
  __entity: string;

  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }
}
