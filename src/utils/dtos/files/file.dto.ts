import { AutoMap } from 'automapper-classes';
import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  @AutoMap()
  id: string;

  @ApiProperty()
  @AutoMap()
  path: string;

  @ApiProperty()
  @AutoMap()
  mimeType: string;
}
