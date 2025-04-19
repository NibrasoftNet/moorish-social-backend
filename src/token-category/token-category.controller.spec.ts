import { Test, TestingModule } from '@nestjs/testing';
import { TokenCategoryController } from './token-category.controller';
import { TokenCategoryService } from './token-category.service';

describe('TokenCategoryController', () => {
  let controller: TokenCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenCategoryController],
      providers: [TokenCategoryService],
    }).compile();

    controller = module.get<TokenCategoryController>(TokenCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
