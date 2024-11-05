import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLostItemDto } from './dto/create-lost-item.dto';
import { UpdateLostItemDto } from './dto/update-lost-item.dto';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';
import { LocationsService } from 'src/locations/locations.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class LostItemsService {
  constructor(
    private readonly dbService: PrismaDbService,
    private readonly postsService: PostsService,
    private readonly locationsService: LocationsService,
  ) {}

  // /**
  //  *
  //  * @param createLostItemDto
  //  * location에 따른 board 존재. post를 생성할 때 lostItem 정보가 존재하면 생성.
  //  * @returns
  //  */
  // async create(
  //   locationId: string,
  //   postId: string,
  //   createLostItemDto: CreateLostItemDto,
  // ) {
  //   const location = await this.locationsService.findOne(locationId); //여기서 이미 예외처리함.
  //   const post = await this.postsService.findOne(postId); //여기서 이미 예외처리함.

  //   const lostItem = await this.dbService.lostItem.create({
  //     data: {
  //       ...createLostItemDto,
  //       locationId,
  //       postId,
  //     },
  //   });

  //   return lostItem;
  // }

  async findAll(locationId?: string) {
    if (locationId) {
      const location = await this.locationsService.findOne(locationId);

      return await this.dbService.lostItem.findMany({
        where: {
          locationId,
        },
      });
    }

    return await this.dbService.lostItem.findMany();
  }

  async findOne(id: string) {
    const lostItem = await this.dbService.lostItem.findUnique({
      where: { id },
    });
    if (!lostItem)
      throw new NotFoundException(`LostItem with ID ${id} not found`);

    return lostItem;
  }

  async findByPostId(postId: string) {
    const lostItem = await this.dbService.lostItem.findUnique({
      where: {
        postId,
      },
    });
    if (!lostItem)
      throw new NotFoundException(`LostItem with postId[${postId}] not found`);
    return lostItem;
  }

  // async update(id: string, updateLostItemDto: UpdateLostItemDto) {
  //   try {
  //     return await this.dbService.lostItem.update({
  //       where: {
  //         id,
  //       },
  //       data: updateLostItemDto,
  //     });
  //   } catch (error) {
  //     throw new NotFoundException(`LostItem with ID ${id} not found`);
  //   }
  // }

  // async remove(id: string) {
  //   try {
  //     return await this.dbService.lostItem.delete({
  //       where: { id },
  //     });
  //   } catch (error) {
  //     throw new NotFoundException(`LostItem with ID ${id} not found`);
  //   }
  // }
}
