// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service'; // S3 업로드를 담당하는 서비스
import * as multer from 'multer';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    // Step 1: 파일이 잘 들어오는지 확인
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    console.log('File received:', file.originalname);

    // Step 2: 버퍼가 제대로 들어있는지 확인
    if (!file.buffer) {
      throw new BadRequestException('File buffer is undefined.');
    }
    console.log('File buffer length:', file.buffer.length);

    // Step 3: S3에 파일 업로드
    const imageUrl = await this.awsService.imageUploadToS3(file);
    console.log('File uploaded to S3, URL:', imageUrl);

    // Step 4: 업로드된 이미지 URL을 반환
    return { imageUrl };
  }
}
