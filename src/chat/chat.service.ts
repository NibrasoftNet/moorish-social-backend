import { Injectable } from '@nestjs/common';
import { CreateOneToOneChatDto } from './dto/create-one-to-one-chat.dto';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { ChatEntity } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { chatPaginationConfig } from './config/chat-pagination-config';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UsersTenantService } from '../users-tenant/users-tenant.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    private readonly userService: UsersService,
    private readonly userTenantService: UsersTenantService,
  ) {}
  async createOneToOne(
    createOneToOneChatDto: CreateOneToOneChatDto,
  ): Promise<ChatEntity> {
    const existingChat = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.sender @> :senderToReceiver', {
        senderToReceiver: { id: createOneToOneChatDto.senderId },
      })
      .andWhere('chat.receiver @> :receiverToSender', {
        receiverToSender: { id: createOneToOneChatDto.receiverId },
      })
      .orWhere('chat.sender @> :receiverToSender', {
        receiverToSender: { id: createOneToOneChatDto.receiverId },
      })
      .andWhere('chat.receiver @> :senderToReceiver', {
        senderToReceiver: { id: createOneToOneChatDto.senderId },
      })
      .getOne();

    if (!!existingChat) {
      return existingChat;
    }

    const chat = this.chatRepository.create();
    chat.sender = createOneToOneChatDto.isSenderAdmin
      ? await this.userTenantService.findOneOrFail({
          id: createOneToOneChatDto.senderId,
        })
      : await this.userService.findOneOrFail({
          id: createOneToOneChatDto.senderId,
        });
    chat.receiver = createOneToOneChatDto.isReceiverAdmin
      ? await this.userTenantService.findOneOrFail({
          id: createOneToOneChatDto.receiverId,
        })
      : await this.userService.findOneOrFail({
          id: createOneToOneChatDto.receiverId,
        });
    return await this.chatRepository.save(chat);
  }

  async createGroup(
    userJwtPayload: JwtPayloadType,
    createGroupChatDto: CreateGroupDto,
  ): Promise<ChatEntity> {
    const chat = this.chatRepository.create({
      name: createGroupChatDto.name,
    });
    chat.creator = await this.userService.findOneOrFail({
      id: userJwtPayload.id,
    });
    chat.isGroup = true;
    return await this.chatRepository.save(chat);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<ChatEntity>> {
    return await paginate<ChatEntity>(
      query,
      this.chatRepository,
      chatPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ): Promise<Paginated<ChatEntity>> {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .leftJoinAndSelect('chat.creator', 'creator')
      .leftJoinAndSelect('chat.participants', 'participants')
      .where('sender.id = :userId', { userId: userJwtPayload.id })
      .orWhere('receiver.id = :userId', { userId: userJwtPayload.id })
      .orWhere('creator.id = :userId', { userId: userJwtPayload.id })
      .orWhere('participants.id = :userId', { userId: userJwtPayload.id });
    return await paginate<ChatEntity>(
      query,
      queryBuilder,
      chatPaginationConfig,
    );
  }

  async getUserChatIds(userId: string): Promise<string[]> {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.creator', 'creator')
      .leftJoinAndSelect('chat.participants', 'participants')
      .where('chat.sender @> :jsonSearch', {
        jsonSearch: { id: userId },
      })
      .orWhere('chat.receiver @> :jsonSearch', {
        jsonSearch: { id: userId },
      })
      .orWhere('creator.id = :userId', { userId })
      .orWhere('participants.id = :userId', { userId })
      .select('chat.id', 'chatId');

    const result = await queryBuilder.getRawMany();
    return result.map((row) => row.chatId);
  }

  async findOne(
    field: FindOptionsWhere<ChatEntity>,
    relations?: FindOptionsRelations<ChatEntity>,
  ): Promise<NullableType<ChatEntity>> {
    return await this.chatRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<ChatEntity>,
    relations?: FindOptionsRelations<ChatEntity>,
  ): Promise<ChatEntity> {
    return await this.chatRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<ChatEntity> {
    const chat = await this.findOneOrFail({ id });
    Object.assign(chat, updateChatDto);
    return await chat.save();
  }

  async remove(id: string) {
    return await this.chatRepository.delete({ id });
  }
}
