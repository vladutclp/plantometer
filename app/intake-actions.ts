"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function logMultipleIntakes(
  _prevState: unknown,
  formData: FormData,
) {
  const plantIds = formData
    .getAll("plantId")
    .map((id) => parseInt(id as string))
    .filter((id) => !isNaN(id));

  if (plantIds.length === 0) return { ok: false };

  const dateStr = formData.get("date") as string;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  await prisma.plantIntake.createMany({
    data: plantIds.map((plantId) => ({ plantId, date })),
  });

  revalidatePath("/");
  return { ok: true };
}

export async function removeIntake(formData: FormData) {
  const intakeId = parseInt(formData.get("intakeId") as string);
  await prisma.plantIntake.delete({ where: { id: intakeId } });
  revalidatePath("/");
}
