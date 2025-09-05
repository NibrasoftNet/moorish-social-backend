import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { UserEntity } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';

@Entity({ name: 'chat' })
export class ChatEntity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: String, nullable: true })
  name?: string | null;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, { nullable: true })
  creator?: UserEntity | null; // Only for group chats

  @AutoMap(() => [UserEntity])
  @ManyToMany(() => UserEntity, { nullable: true })
  @JoinTable()
  participants?: UserEntity[] | null;

  @AutoMap()
  @Column({ default: false })
  isGroup: boolean;

  @AutoMap()
  @Column({ type: 'jsonb', nullable: true })
  sender?: Record<string, any> | null;

  @AutoMap()
  @Column({ type: 'jsonb', nullable: true })
  receiver?: Record<string, any> | null;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  validateChatType() {
    if (this.isGroup) {
      // Clear one-to-one fields to ensure consistency
      this.sender = null;
      this.receiver = null;
    } else {
      // Clear group-specific fields to ensure consistency
      this.name = null;
      this.creator = null;
      this.participants = null;
    }
  }
}
