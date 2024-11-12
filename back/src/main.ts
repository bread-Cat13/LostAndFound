import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:8000',
      'http://lostandfound1.s3-website.ap-northeast-2.amazonaws.com',
    ], // 허용할 프론트엔드 주소
    credentials: true, // 쿠키 사용 시 필요
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
