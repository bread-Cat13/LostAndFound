import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async imageUploadToS3(file: Express.Multer.File): Promise<string> {
    if (!file.buffer) {
      throw new InternalServerErrorException('File buffer is undefined');
    }

    const fileName = `${uuidv4()}_${file.originalname}`;
    const uploadParams = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new InternalServerErrorException('Failed to upload image to S3');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: fileName,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new InternalServerErrorException('Failed to delete image from S3');
    }
  }
}
