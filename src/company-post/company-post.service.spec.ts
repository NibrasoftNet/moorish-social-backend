import { Test, TestingModule } from '@nestjs/testing';
import { CompanyPostService } from './company-post.service';

describe('CompanyPostService', () => {
  let service: CompanyPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyPostService],
    }).compile();

    service = module.get<CompanyPostService>(CompanyPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
