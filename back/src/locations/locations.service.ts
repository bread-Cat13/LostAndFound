import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class LocationsService {
  constructor(private readonly dbService: PrismaDbService) {}

  async create(createLocationDto: CreateLocationDto) {
    // Location 생성
    const location = await this.dbService.location.create({
      data: createLocationDto,
    });

    // Location에 연결된 Board 생성
    await this.dbService.board.create({
      data: {
        locationId: location.id,
        name: `${location.name}의 분실물 게시판`, // 기본적으로 Location 이름을 포함한 게시판 이름 생성
      },
    });

    // Board를 포함한 Location 반환
    return this.findOne(location.id);
  }

  async findLocationWithBoardAndPosts(locationId: string) {
    const location = await this.dbService.location.findUnique({
      where: {
        id: locationId,
      },
      include: {
        board: {
          include: {
            posts: true,
          },
        },
      },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${locationId} not found`);
    }
    return location;
  }

  async findAll() {
    // 모든 Location을 가져올 때 관련 Board 데이터도 함께 가져오기
    return await this.dbService.location.findMany({
      include: { board: true },
    });
  }

  async findOne(id: string) {
    // 단일 Location 조회 시 관련 Board 데이터 포함
    const location = await this.dbService.location.findUnique({
      where: { id },
      include: { board: true },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      const updatedLocation = await this.dbService.location.update({
        where: { id },
        data: updateLocationDto,
      });
      return updatedLocation; // 업데이트된 데이터를 반환
    } catch (error) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const deletedLocation = await this.dbService.location.delete({
        where: { id },
      });
      return deletedLocation; // 삭제된 데이터를 반환
    } catch (error) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }
}
