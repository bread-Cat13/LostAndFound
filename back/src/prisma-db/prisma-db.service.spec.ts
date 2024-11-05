import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDbService } from './prisma-db.service';

describe('PrismaDbService', () => {
  let service: PrismaDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaDbService],
    }).compile();

    service = module.get<PrismaDbService>(PrismaDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
