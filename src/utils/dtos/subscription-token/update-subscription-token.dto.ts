import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionTokenDto } from './create-subscription-token.dto';

export class UpdateSubscriptionTokenDto extends PartialType(
  CreateSubscriptionTokenDto,
) {}
