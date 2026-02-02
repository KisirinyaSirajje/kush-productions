/*
  Warnings:

  - You are about to drop the column `foodId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.
  - Added the required column `type` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `favorites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `items` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_foodId_fkey";

-- DropIndex
DROP INDEX "favorites_userId_movieId_key";

-- DropIndex
DROP INDEX "orders_foodId_idx";

-- DropIndex
DROP INDEX "ratings_userId_movieId_key";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "foodId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "movieId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "favorites" ADD COLUMN     "foodId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "movieId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "foods" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "foodId",
DROP COLUMN "quantity",
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "items" JSONB NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "foodId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "movieId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "comments_foodId_idx" ON "comments"("foodId");

-- CreateIndex
CREATE INDEX "favorites_type_idx" ON "favorites"("type");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "ratings_foodId_idx" ON "ratings"("foodId");

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
