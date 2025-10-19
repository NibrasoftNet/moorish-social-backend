import { IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class SpecificationDto {
  @AutoMap()
  @IsString()
  key: string;

  @AutoMap()
  @IsString()
  value: string;
}
