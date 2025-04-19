import { Test, TestingModule } from '@nestjs/testing';
import { TokenCategoryService } from './token-category.service';

describe('TokenCategoryService', () => {
  let service: TokenCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenCategoryService],
    }).compile();

    service = module.get<TokenCategoryService>(TokenCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
