import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTokenService } from './subscription-token.service';

describe('SubscriptionTokenService', () => {
  let service: SubscriptionTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionTokenService],
    }).compile();

    service = module.get<SubscriptionTokenService>(SubscriptionTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
