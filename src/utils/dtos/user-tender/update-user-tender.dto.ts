import { PartialType } from '@nestjs/swagger';
import { CreateUserTenderDto } from './create-user-tender.dto';

export class UpdateUserTenderDto extends PartialType(CreateUserTenderDto) {}
