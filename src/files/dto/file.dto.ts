import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { EntityHelperDto } from '@/domains/entity-helper.dto';

export class FileDto extends EntityHelperDto {
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
