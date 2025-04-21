import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { Chat } from './chat.entity';
import { MessageTypeEnum } from '@/enums/message-type.enum';
import { AutoMap } from 'automapper-classes';
import { UserEntity } from '../../users/entities/user.entity';

@Entity()
export class Message extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;

  @AutoMap(() => UserEntity)
  @Column({ type: 'jsonb', nullable: false })
  sender: Record<string, any>;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: MessageTypeEnum,
    default: MessageTypeEnum.TEXT,
  })
  contentType: MessageTypeEnum;

  @AutoMap(() => [String])
  @Column('text', { array: true })
  content: string[];
}
