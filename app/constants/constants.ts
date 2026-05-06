import { PlantType } from "../generated/prisma/enums";

export const TYPE_LABELS: Record<PlantType, string> = {
  Vegetables: "Vegetables",
  Fruits: "Fruits",
  Grains: "Grains",
  Legumes: "Legumes",
  NutsAndSeeds: "Nuts & Seeds",
  HerbsAndSpices: "Herbs & Spices",
};

export const TYPE_COLORS: Record<PlantType, string> = {
  Vegetables: "#72c441",
  Fruits: "#f59e0b",
  Grains: "#d4a853",
  Legumes: "#7cb87a",
  NutsAndSeeds: "#b58a4a",
  HerbsAndSpices: "#8b5cf6",
};

export const ALL_TYPES = Object.values(PlantType);
