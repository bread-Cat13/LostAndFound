import { Module } from '@nestjs/common';
import { LostItemsService } from './lost-items.service';
// import { LostItemsController } from './lost-items.controller';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';
import { LocationsService } from 'src/locations/locations.service';
import { PostsService } from 'src/posts/posts.service';
import { LocationsModule } from 'src/locations/locations.module';
import { PostsModule } from 'src/posts/posts.module';
import { BoardsService } from 'src/boards/boards.service';
import { AwsService } from 'src/aws/aws.service';
import { ConfigService } from '@nestjs/config';
import { ImagesService } from 'src/images/images.service';

@Module({
  // controllers: [LostItemsController],
  imports: [LocationsModule, PostsModule],
  providers: [
    LostItemsService,
    PrismaDbService,
    LocationsService,
    PostsService,
    BoardsService,
    AwsService,
    ConfigService,
    ImagesService,
  ],
})
export class LostItemsModule {}
