import { ConfigModule } from '@nestjs/config';
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
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaDbModule,
    UsersModule,
    BoardsModule,
    PostsModule,
    ImagesModule,
    LocationsModule,
    LostItemsModule,
    AwsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
