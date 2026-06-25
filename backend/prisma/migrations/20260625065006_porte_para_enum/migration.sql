/*
  Warnings:

  - Changed the type of `size` on the `animals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AnimalSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- AlterTable
ALTER TABLE "animals" DROP COLUMN "size",
ADD COLUMN     "size" "AnimalSize" NOT NULL;
