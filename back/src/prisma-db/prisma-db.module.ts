import { Module } from '@nestjs/common';
import { PrismaDbService } from './prisma-db.service';

@Module({
  providers: [PrismaDbService],
  exports: [PrismaDbService],
})
export class PrismaDbModule {}
