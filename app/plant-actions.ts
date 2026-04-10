"use server";

import prisma from "@/lib/prisma";
import { PlantType } from "./generated/prisma/enums";
import { revalidatePath } from "next/cache";

type ActionResult = { error?: string };

export async function createPlant(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = (formData.get("name") as string).trim().toLowerCase();
  const type = formData.get("type") as string;

  if (!name) return { error: "Plant name is required." };

  try {
    await prisma.plant.create({
      data: { name, type: type as PlantType },
    });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return { error: `"${name}" already exists in your catalog.` };
    }
    throw e;
  }

  revalidatePath("/plants");
  revalidatePath("/");
  return {};
}

export async function updatePlant(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string).trim().toLowerCase();
  const type = formData.get("type") as string;

  if (!name) return { error: "Plant name is required." };

  try {
    await prisma.plant.update({
      where: { id },
      data: { name, type: type as PlantType },
    });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return { error: `"${name}" already exists in your catalog.` };
    }
    throw e;
  }

  revalidatePath("/plants");
  revalidatePath("/");
  return {};
}

export async function deletePlant(plantId: number): Promise<ActionResult> {
  try {
    await prisma.plant.delete({ where: { id: plantId } });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2003") {
      return {
        error:
          "This plant has logged entries. Edit the name or type instead, or delete its entries from the log first.",
      };
    }
    throw e;
  }

  revalidatePath("/plants");
  revalidatePath("/");
  return {};
}
