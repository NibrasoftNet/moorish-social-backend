import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { UserTenantEntity } from '../../users-tenant/entities/user-tenant.entity';
import { CompanyOfferEntity } from '../../company-offer/entities/company-offer.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'user_request_offer' })
export class UserRequestOfferEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column('text', { nullable: false })
  request: string;

  @AutoMap(() => CompanyOfferEntity)
  @ManyToOne(() => CompanyOfferEntity, (offer) => offer.request, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  offer: CompanyOfferEntity;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  creator: UserEntity;

  @AutoMap(() => UserTenantEntity)
  @ManyToOne(() => UserTenantEntity, {
    nullable: true,
  })
  answerer: UserTenantEntity;

  @AutoMap()
  @Column('text', { nullable: true })
  response: string;

  @AutoMap()
  @Column({ default: false })
  closed: boolean;
}
