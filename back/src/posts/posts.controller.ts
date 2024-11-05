import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
// import { CreateLostItemDto } from 'src/lost-items/dto/create-lost-item.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, { storage: multer.memoryStorage() }),
  ) // memoryStorage 옵션 설정
  async create(
    @Query('boardId') boardId: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('Controller for create 호출됨', boardId, createPostDto);

    // 여기에 파일 버퍼 확인 추가
    files.forEach((file) => {
      console.log(`File buffer length: ${file.buffer?.length}`);
      if (!file.buffer) {
        throw new Error('File buffer is undefined.');
      }
    });

    return this.postsService.create(boardId, createPostDto, files);
  }

  // @Post()
  // @UseInterceptors(FilesInterceptor('files'))
  // async create(
  //   @Query('boardId') boardId: string,
  //   @Body() createPostDto: CreatePostDto,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   console.log('Controller for create 호출됨', boardId, createPostDto);
  //   return this.postsService.create(boardId, createPostDto, files);
  // }

  @Get()
  findAll(@Query() boardId?: string) {
    if (boardId) return this.postsService.findAll(boardId);
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('PostController findOne handler');
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.update(id, updatePostDto, files);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(id, updatePostDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
