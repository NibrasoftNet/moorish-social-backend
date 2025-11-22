import { AutoMap } from '@automapper/classes';
import { EntityHelperDto } from '@/domains/entity-helper.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryTokenDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => [Object])
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: {
      en: 'Painting',
      fr: 'Peinture',
      ar: 'دهان',
    },
  })
  label: Record<string, string>;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  description: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  value: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  price: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;
}
