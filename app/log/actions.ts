"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateIntakePlant(intakeId: number, newPlantId: number) {
  await prisma.plantIntake.update({
    where: { id: intakeId },
    data: { plantId: newPlantId },
  });
  revalidatePath("/log");
  revalidatePath("/");
}
