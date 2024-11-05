/*
  Warnings:

  - You are about to drop the column `dateFound` on the `LostItem` table. All the data in the column will be lost.
  - Added the required column `foundDate` to the `LostItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnDate` to the `LostItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LostItem" DROP COLUMN "dateFound",
ADD COLUMN     "foundDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL;
