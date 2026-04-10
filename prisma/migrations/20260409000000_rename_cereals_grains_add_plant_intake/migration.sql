-- Rename Cereals → Grains in PlantType enum
ALTER TYPE "PlantType" RENAME VALUE 'Cereals' TO 'Grains';

-- CreateTable
CREATE TABLE "PlantIntake" (
    "id" SERIAL NOT NULL,
    "plantId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    CONSTRAINT "PlantIntake_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlantIntake" ADD CONSTRAINT "PlantIntake_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
