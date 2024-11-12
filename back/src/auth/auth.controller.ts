import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from './auth.guard';
import { Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User successfully registered',
      user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto.email, createUserDto.password);
  }

  @UseGuards(AuthGuard) // AuthGuard를 사용하여 보호
  @Get('user-id')
  async getUserId(@Request() req) {
    return req.user; // AuthGuard가 req.user에 사용자 정보를 설정하므로 직접 접근 가능
  }

  @Get('user-id2')
  async getUserId2(@Headers('Authorization') authHeader: string) {
    console.log('authHeader=', authHeader);
    const token = authHeader.split(' ')[1]; // Bearer 토큰에서 실제 토큰 추출
    console.log('\ntoken=', token);
    const userId = await this.authService.getUserIdFromToken(token);
    return { id: userId };
  }
}
