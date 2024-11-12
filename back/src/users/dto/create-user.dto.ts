import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../../validators/IsStrongPasswordValidator'; // 경로 맞게 수정

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword() // 여기에서 커스텀 유효성 검사기를 사용
  password: string;
}
