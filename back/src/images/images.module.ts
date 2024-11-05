import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';
import { AwsService } from 'src/aws/aws.service';
import { ConfigService } from '@nestjs/config';
// import { ImagesController } from './images.controller';

@Module({
  // controllers: [ImagesController],
  providers: [ImagesService, PrismaDbService, AwsService, ConfigService],
  exports: [ImagesService],
})
export class ImagesModule {}
