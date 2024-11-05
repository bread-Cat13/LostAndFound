import { Status } from '@prisma/client';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLostItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date) // 날짜 변환 설정 추가
  @IsNotEmpty()
  foundDate: Date;

  @IsDate()
  @Type(() => Date) // 날짜 변환 설정 추가
  @IsOptional() // 선택적 필드로 설정
  returnDate?: Date;

  @IsEnum(Status)
  status: Status;

  @IsArray()
  @IsString({ each: true }) // 각 요소가 string임을 확인
  @IsOptional()
  images: Express.Multer.File[]; // 이미지 URL 배열
}
