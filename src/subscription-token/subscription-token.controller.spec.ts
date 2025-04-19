import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTokenController } from './subscription-token.controller';
import { SubscriptionTokenService } from './subscription-token.service';

describe('SubscriptionTokenController', () => {
  let controller: SubscriptionTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionTokenController],
      providers: [SubscriptionTokenService],
    }).compile();

    controller = module.get<SubscriptionTokenController>(SubscriptionTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
