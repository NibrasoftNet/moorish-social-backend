import { Test, TestingModule } from '@nestjs/testing';
import { CompanyPostController } from './company-post.controller';
import { CompanyPostService } from './company-post.service';

describe('CompanyPostController', () => {
  let controller: CompanyPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyPostController],
      providers: [CompanyPostService],
    }).compile();

    controller = module.get<CompanyPostController>(CompanyPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
