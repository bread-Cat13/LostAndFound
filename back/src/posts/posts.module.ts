import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';
import { BoardsService } from 'src/boards/boards.service';
import { AwsService } from 'src/aws/aws.service';
import { ImagesService } from 'src/images/images.service';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // 파일이 임시로 저장될 경로
    }),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PrismaDbService,
    BoardsService,
    AwsService,
    ImagesService,
    ConfigService,
  ],
  exports: [PostsService],
})
export class PostsModule {}
