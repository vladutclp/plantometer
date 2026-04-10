/*
  Warnings:

  - The `type` column on the `Plant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PlantType" AS ENUM ('Vegetables', 'Fruits', 'Cereals', 'Legumes', 'NutsAndSeeds', 'HerbsAndSpices');

-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "type",
ADD COLUMN     "type" "PlantType";
