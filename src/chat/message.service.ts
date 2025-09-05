import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { ChatEntity } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async create(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<MessageEntity> {
    const message = this.messageRepository.create(
      createChatMessageDto as DeepPartial<MessageEntity>,
    );
    message.sender = createChatMessageDto.sender as unknown as UserEntity;
    message.chat = createChatMessageDto.chat as unknown as ChatEntity;
    message.content = createChatMessageDto.content;
    return await this.messageRepository.save(message);
  }

  findAll() {
    return `This action returns all chat`;
  }

  async findOne(
    field: FindOptionsWhere<MessageEntity>,
    relations?: FindOptionsRelations<MessageEntity>,
  ): Promise<NullableType<MessageEntity>> {
    return await this.messageRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<MessageEntity>,
    relations?: FindOptionsRelations<MessageEntity>,
  ): Promise<MessageEntity> {
    return await this.messageRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: string, updateChatMessageDto: UpdateChatMessageDto) {
    const message = await this.findOneOrFail({ id });
    Object.assign(message, updateChatMessageDto);
    return await this.messageRepository.save(message);
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
