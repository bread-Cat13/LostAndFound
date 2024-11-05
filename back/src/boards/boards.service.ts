import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class BoardsService {
  constructor(private readonly dbService: PrismaDbService) {}

  async create(createBoardDto: CreateBoardDto & { locationId: string }) {
    const { locationId, name } = createBoardDto;

    return await this.dbService.board.create({
      data: {
        name,
        locationId,
      },
    });
  }

  async findAll() {
    return this.dbService.board.findMany({
      include: { posts: true }, // 필요시 posts 포함
    });
  }

  async findOne(id: string) {
    const board = await this.dbService.board.findUnique({
      where: { id },
      include: { posts: true }, // 관련된 posts[] 데이터를 함께 가져옴
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    try {
      return await this.dbService.board.update({
        data: updateBoardDto,
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.dbService.board.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  }
}
