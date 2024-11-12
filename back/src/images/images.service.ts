import { Injectable, NotFoundException } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class ImagesService {
  constructor(
    private readonly s3Service: AwsService,
    private readonly dbService: PrismaDbService,
  ) {}

  // images.service.ts
  async uploadAndSaveImage(lostItemId: string, file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is not provided.');
    }

    if (!file.buffer) {
      throw new Error('File buffer is undefined.');
    }

    console.log('LostItem ID received in uploadAndSaveImage:', lostItemId); // 로그 추가
    console.log('File buffer length:', file.buffer.length);

    const imageUrl = await this.s3Service.imageUploadToS3(file);
    console.log('ImageUrl from imgsService=', imageUrl);

    // 데이터베이스에 이미지 URL과 연결된 LostItem ID 저장
    await this.dbService.image.create({
      data: {
        url: imageUrl,
        lostItemId,
      },
    });

    return imageUrl;
  }

  async getImagesByLostItemId(lostItemId: string): Promise<string[]> {
    const images = await this.dbService.image.findMany({
      where: {
        lostItemId,
      },
    });
    console.log('images = ', images);
    return images.map((image) => image.url);
  }

  // 2. 저장된 이미지 URL 조회
  async getImageUrl(imageId: string): Promise<string> {
    const image = await this.dbService.image.findUnique({
      where: { id: imageId },
      select: { url: true },
    });

    if (!image) throw new NotFoundException('Image not found');
    return image.url;
  }

  // 3. 이미지 삭제 (S3와 DB에서 삭제)
  async deleteImage(imageId: string) {
    const image = await this.dbService.image.findUnique({
      where: { id: imageId },
      select: { url: true },
    });

    if (!image) throw new NotFoundException('Image not found');

    // S3에서 삭제
    const fileName = image.url.split('/').pop(); // URL에서 파일명 추출
    await this.s3Service.deleteFile(fileName);

    // DB에서 이미지 삭제
    await this.dbService.image.delete({
      where: { id: imageId },
    });
  }
}
