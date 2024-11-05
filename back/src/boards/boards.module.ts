import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';
// import { BoardsController } from './boards.controller';

@Module({
  // controllers: [BoardsController],
  providers: [BoardsService, PrismaDbService],
  exports: [BoardsService],
})
export class BoardsModule {}
