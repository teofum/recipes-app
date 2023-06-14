-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'es');

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "primaryLanguage" "Language" NOT NULL DEFAULT 'en';
