import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: PrismaDbService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.dbService.user.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll() {
    return await this.dbService.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.dbService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.dbService.user.update({
        data: updateUserDto,
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.dbService.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
