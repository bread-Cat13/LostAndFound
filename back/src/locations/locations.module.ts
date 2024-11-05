import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService, PrismaDbService],
  exports: [LocationsService],
})
export class LocationsModule {}
