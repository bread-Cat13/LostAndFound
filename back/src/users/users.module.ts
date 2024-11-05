import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaDbService],
  exports: [UsersService],
})
export class UsersModule {}
