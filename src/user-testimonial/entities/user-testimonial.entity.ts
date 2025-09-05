import { AutoMap } from 'automapper-classes';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity({ name: 'user_testimonial' })
export class UserTestimonialEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  comment: string;

  @AutoMap()
  @Column()
  rate: number;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: false,
  })
  creator: UserEntity;
}
