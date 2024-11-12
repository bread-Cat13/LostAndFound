import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
// import * as jwt from 'jsonwebtoken';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // DTO 검증
    const errors = await validate(plainToClass(CreateUserDto, createUserDto));
    if (errors.length > 0) {
      // 한국어 메시지로 변환
      const messages = errors.map((error: ValidationError) => {
        const constraints = error.constraints;
        return constraints ? Object.values(constraints).join(', ') : '';
      });

      throw new BadRequestException(
        `Validation failed: ${messages.join(', ')}`,
      );
    }

    const existingUserByName = await this.usersService.findByName(
      createUserDto.name,
    );
    if (existingUserByName) {
      throw new ConflictException('이미 존재하는 이름입니다.');
    }

    const existingUserByEmail = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUserDto = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    };
    return this.usersService.create(newUserDto);
  }

  async login(email: string, password: string) {
    const foundUser = await this.usersService.findByEmail(email);
    if (!foundUser) {
      throw new UnauthorizedException(`User with Email ${email} not found`);
    } else if (!(await bcrypt.compare(password, foundUser.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...payload } = foundUser;
    return {
      email,
      username: payload.name,
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }

  async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      console.log('userId from service = ', payload.id);
      return payload.id; // 사용자 ID 반환
    } catch (error) {
      return null; // 토큰 검증 실패 시 null 반환
    }
  }
}
