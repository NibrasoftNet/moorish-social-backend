import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '@/domains/api-response.dto';

export class AddressDto extends EntityHelperDto {
  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  country: string;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  city: string;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  longitude: number;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  latitude: number;

  @AutoMap()
  @ApiProperty()
  //@Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  street: string;
}

export class ApiAddressDto extends ApiResponseDto {
  @ApiProperty({ type: AddressDto, isArray: false })
  result: AddressDto;
}
