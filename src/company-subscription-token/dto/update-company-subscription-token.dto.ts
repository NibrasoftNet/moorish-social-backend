import { PartialType } from '@nestjs/swagger';
import { CreateCompanySubscriptionTokenDto } from './create-company-subscription-token.dto';

export class UpdateCompanySubscriptionTokenDto extends PartialType(
  CreateCompanySubscriptionTokenDto,
) {}
