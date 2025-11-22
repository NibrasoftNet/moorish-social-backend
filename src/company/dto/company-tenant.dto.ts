import { AutoMap } from '@automapper/classes';
import { FileDto } from '../../files/dto/file.dto';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyTenantDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  email: string;

  @AutoMap(() => String)
  @ApiProperty()
  firstName: string;

  @AutoMap(() => String)
  @ApiProperty()
  lastName: string;

  @AutoMap()
  @ApiPropertyOptional({ type: String, nullable: true })
  position: string | null;

  @AutoMap()
  @ApiPropertyOptional({ type: String, nullable: true })
  whatsApp: string;

  @AutoMap(() => FileDto)
  @ApiPropertyOptional({ type: FileDto, nullable: true })
  image: FileDto;
}
