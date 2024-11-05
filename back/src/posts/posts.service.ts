import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';
import { BoardsService } from 'src/boards/boards.service';
import { AwsService } from 'src/aws/aws.service';
import { ImagesService } from 'src/images/images.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private readonly dbService: PrismaDbService,
    private readonly boardsService: BoardsService,
    private readonly awsService: AwsService,
    private readonly imagesService: ImagesService,
  ) {}

  async create(
    boardId: string,
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
  ) {
    const board = await this.boardsService.findOne(boardId);

    // 1. Post와 LostItem 생성은 트랜잭션 내에서 처리
    const { post, lostItem } = await this.dbService.$transaction(
      async (dbService) => {
        const post = await dbService.post.create({
          data: {
            boardId,
            title: createPostDto.title,
            content: createPostDto.content,
            authorId: createPostDto.authorId,
          },
        });

        const lostItemData =
          typeof createPostDto.lostItem === 'string'
            ? JSON.parse(createPostDto.lostItem)
            : createPostDto.lostItem;

        const foundDate = lostItemData.foundDate
          ? new Date(lostItemData.foundDate)
          : null;
        const returnDate = lostItemData.returnDate
          ? new Date(lostItemData.returnDate)
          : null;

        const lostItem = await dbService.lostItem.create({
          data: {
            ...lostItemData,
            foundDate,
            returnDate,
            locationId: board.locationId,
            postId: post.id,
          },
        });

        return { post, lostItem };
      },
    );

    console.log('Post created:', post);
    console.log('LostItem created:', lostItem);

    // 2. S3 업로드 및 Image 저장은 트랜잭션 외부에서 처리
    let imageUrls: string[] = [];
    try {
      // if (files && files.length > 0) {
      //   imageUrls = await Promise.all(
      //     files.map(async (file) => {
      //       console.log('Uploading file:', file.originalname);

      //       // S3에 파일을 업로드하고 URL 반환
      //       const imageUrl = await this.imagesService.uploadAndSaveImage(
      //         lostItem.id,
      //         file,
      //       );
      //       console.log('Image uploaded:', imageUrl);
      //       return imageUrl;
      //     }),
      //   );
      // }

      // 새로운 이미지가 있으면 업로드 및 저장
      if (files && files.length > 0) {
        await Promise.all(
          files.map(async (file) => {
            console.log('Uploading file:', file.originalname);
            const imageUrl = await this.imagesService.uploadAndSaveImage(
              lostItem.id,
              file,
            );
            console.log('Image uploaded:', imageUrl);
            return imageUrl;
          }),
        );
      } else {
        console.warn('No files to upload.');
      }
    } catch (error) {
      console.error('Image upload or save failed:', error);

      // 업로드 실패 시 생성된 Post와 LostItem 롤백
      await this.dbService.$transaction(async (dbService) => {
        try {
          await dbService.lostItem.delete({ where: { id: lostItem.id } });
        } catch (deleteError) {
          console.error('Failed to delete LostItem:', deleteError);
        }

        try {
          await dbService.post.delete({ where: { id: post.id } });
        } catch (deleteError) {
          console.error('Failed to delete Post:', deleteError);
        }
      });

      throw new Error(
        'Failed to upload images, rolled back post and lost item creation',
      );
    }

    return { post, lostItem, images: imageUrls };
  }

  // posts.service.ts
  // async create(
  //   boardId: string,
  //   createPostDto: CreatePostDto,
  //   files: Express.Multer.File[],
  // ) {
  //   const board = await this.boardsService.findOne(boardId);

  //   // 1. Post와 LostItem 생성은 트랜잭션 내에서 처리
  //   const { post, lostItem } = await this.dbService.$transaction(
  //     async (dbService) => {
  //       const post = await dbService.post.create({
  //         data: {
  //           boardId,
  //           title: createPostDto.title,
  //           content: createPostDto.content,
  //           authorId: createPostDto.authorId,
  //         },
  //       });

  //       const lostItemData =
  //         typeof createPostDto.lostItem === 'string'
  //           ? JSON.parse(createPostDto.lostItem)
  //           : createPostDto.lostItem;

  //       const foundDate = lostItemData.foundDate
  //         ? new Date(lostItemData.foundDate)
  //         : null;
  //       const returnDate = lostItemData.returnDate
  //         ? new Date(lostItemData.returnDate)
  //         : null;

  //       const lostItem = await dbService.lostItem.create({
  //         data: {
  //           ...lostItemData,
  //           foundDate,
  //           returnDate,
  //           locationId: board.locationId,
  //           postId: post.id,
  //         },
  //       });

  //       return { post, lostItem };
  //     },
  //   );

  //   console.log('Post created:', post);
  //   console.log('LostItem created:', lostItem);

  //   // 2. S3 업로드 및 Image 저장은 트랜잭션 외부에서 처리
  //   const imageUrls = await Promise.all(
  //     files.map(async (file) => {
  //       console.log('Uploading file:', file.originalname);

  //       // S3에 파일을 업로드하고 URL 반환
  //       const imageUrl = await this.imagesService.uploadAndSaveImage(
  //         lostItem.id,
  //         file,
  //       );
  //       console.log('Image uploaded:', imageUrl);
  //       return imageUrl;
  //     }),
  //   );

  //   return { post, lostItem, images: imageUrls };
  // }

  // async create(
  //   boardId: string,
  //   createPostDto: CreatePostDto,
  //   files: Express.Multer.File[],
  // ) {
  //   const board = await this.boardsService.findOne(boardId);

  //   // 트랜잭션 안에서 순차적으로 Post, LostItem, 그리고 Images를 생성
  //   return await this.dbService.$transaction(async (dbService) => {
  //     // 1. Post를 먼저 생성
  //     const post = await dbService.post.create({
  //       data: {
  //         boardId, // Board와 연결
  //         title: createPostDto.title,
  //         content: createPostDto.content,
  //         authorId: createPostDto.authorId,
  //       },
  //     });

  //     // 2. createPostDto.lostItem을 JSON.parse로 객체로 변환
  //     const lostItemData =
  //       typeof createPostDto.lostItem === 'string'
  //         ? JSON.parse(createPostDto.lostItem)
  //         : createPostDto.lostItem;

  //     // 날짜 변환
  //     const foundDate = lostItemData.foundDate
  //       ? new Date(lostItemData.foundDate)
  //       : null;
  //     const returnDate = lostItemData.returnDate
  //       ? new Date(lostItemData.returnDate)
  //       : null;

  //     // LostItem 생성
  //     const lostItem = await dbService.lostItem.create({
  //       data: {
  //         ...lostItemData,
  //         foundDate: foundDate, // 변환된 날짜
  //         returnDate: returnDate, // 변환된 날짜 또는 null
  //         locationId: board.locationId,
  //         postId: post.id,
  //       },
  //     });

  //     // 3. S3에 파일 업로드 및 Image 테이블에 저장
  //     const imageUrls = await Promise.all(
  //       files.map(async (file) => {
  //         // ImageService를 사용해서 이미지 업로드 및 저장
  //         return await this.imagesService.uploadAndSaveImage(lostItem.id, file);
  //       }),
  //     );

  //     return { post, lostItem, images: imageUrls };
  //   });
  // }

  async findAll(boardId?: string) {
    if (boardId) {
      return await this.dbService.post.findMany({
        where: {
          boardId,
        },
      });
    }
    return await this.dbService.post.findMany();
  }

  async findOne(id: string) {
    console.log('postService.findOne method');
    const post = await this.dbService.post.findUnique({
      where: { id },
      include: { lostItem: true }, // images 제외
    });

    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

    // ImageService를 통해 이미지 URL을 가져옴
    if (post.lostItem) {
      const imageUrlArr = await this.imagesService.getImagesByLostItemId(
        post.lostItem.id,
      );

      console.log('imageUrl = ', imageUrlArr);
      post.lostItem['images'] = imageUrlArr;
    }

    console.log('post = ', post);

    return post;
  }

  // async findOne(id: string) {
  //   const post = await this.dbService.post.findUnique({
  //     where: {
  //       id,
  //     },
  //     include: {
  //       lostItem: {
  //         include: {
  //           images: true, // LostItem의 images도 포함
  //         },
  //       },
  //     },
  //   });

  //   console.log('Fetched Post Data:', post);

  //   if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

  //   return post;
  // }

  async update(
    id: string,
    updatePostDto: CreatePostDto,
    files: Express.Multer.File[],
  ) {
    return await this.dbService.$transaction(async (dbService) => {
      // Post 업데이트
      const post = await dbService.post.update({
        where: { id },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
        },
      });

      // LostItem 업데이트
      const lostItemData =
        typeof updatePostDto.lostItem === 'string'
          ? JSON.parse(updatePostDto.lostItem)
          : updatePostDto.lostItem;

      const foundDate = lostItemData.foundDate
        ? new Date(lostItemData.foundDate)
        : null;
      const returnDate = lostItemData.returnDate
        ? new Date(lostItemData.returnDate)
        : null;

      const lostItem = await dbService.lostItem.update({
        where: { postId: id },
        data: {
          ...lostItemData,
          foundDate,
          returnDate,
        },
      });

      // 새로운 이미지가 있으면 업로드 및 저장
      if (files && files.length > 0) {
        await Promise.all(
          files.map(async (file) => {
            await this.imagesService.uploadAndSaveImage(lostItem.id, file);
          }),
        );
      }

      return { post, lostItem };
    });
  }

  // async update(id: string, updatePostDto: UpdatePostDto) {
  //   try {
  //     const updateData: Prisma.PostUpdateInput = {
  //       title: updatePostDto.title,
  //       content: updatePostDto.content,
  //       ...(updatePostDto.authorId && { authorId: updatePostDto.authorId }),
  //     };

  //     return this.dbService.post.update({
  //       where: { id },
  //       data: updateData,
  //     });
  //   } catch (error) {
  //     throw new NotFoundException(`Post with ID ${id} not found`);
  //   }
  // }

  async remove(id: string) {
    try {
      return this.dbService.post.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
