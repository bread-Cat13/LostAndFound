import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaDbModule } from './prisma-db/prisma-db.module';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { PostsModule } from './posts/posts.module';
import { ImagesModule } from './images/images.module';
import { LocationsModule } from './locations/locations.module';
import { LostItemsModule } from './lost-items/lost-items.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    PrismaDbModule,
    UsersModule,
    BoardsModule,
    PostsModule,
    ImagesModule,
    LocationsModule,
    LostItemsModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
