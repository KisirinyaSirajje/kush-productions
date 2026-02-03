-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerificationToken" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerificationExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_emailVerificationToken_key" ON "users"("emailVerificationToken");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_emailVerificationToken_idx" ON "users"("emailVerificationToken");
