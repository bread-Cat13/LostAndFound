-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_lostItemId_fkey";

-- DropForeignKey
ALTER TABLE "LostItem" DROP CONSTRAINT "LostItem_locationId_fkey";

-- DropForeignKey
ALTER TABLE "LostItem" DROP CONSTRAINT "LostItem_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_boardId_fkey";

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostItem" ADD CONSTRAINT "LostItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostItem" ADD CONSTRAINT "LostItem_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_lostItemId_fkey" FOREIGN KEY ("lostItemId") REFERENCES "LostItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
