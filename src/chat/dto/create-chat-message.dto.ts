import { MessageTypeEnum } from '@/enums/message-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ChatDto } from './chat.dto';
import { UserDto } from '../../users/user/user.dto';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateChatMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  chat: ChatDto;

  @ApiProperty()
  @IsNotEmpty()
  sender: UserDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isSenderAdmin: boolean;

  @ApiProperty()
  @IsArray()
  content: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MessageTypeEnum)
  contentType: MessageTypeEnum;
}
