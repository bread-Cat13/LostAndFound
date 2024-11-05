import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateLostItemDto } from 'src/lost-items/dto/create-lost-item.dto';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsOptional()
  lostItem?: CreateLostItemDto;
}
