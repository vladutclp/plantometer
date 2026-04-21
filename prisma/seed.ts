import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import { PlantType } from "../app/generated/prisma/enums.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const plants = [
  // Vegetables
  { name: "tomato", type: PlantType.Vegetables },
  { name: "carrot", type: PlantType.Vegetables },
  { name: "spinach", type: PlantType.Vegetables },
  { name: "broccoli", type: PlantType.Vegetables },
  { name: "cucumber", type: PlantType.Vegetables },
  { name: "bell pepper", type: PlantType.Vegetables },
  { name: "zucchini", type: PlantType.Vegetables },
  // Fruits
  { name: "apple", type: PlantType.Fruits },
  { name: "banana", type: PlantType.Fruits },
  { name: "orange", type: PlantType.Fruits },
  { name: "strawberry", type: PlantType.Fruits },
  { name: "blueberry", type: PlantType.Fruits },
  { name: "mango", type: PlantType.Fruits },
  { name: "grapes", type: PlantType.Fruits },
  // Grains
  { name: "rice", type: PlantType.Grains },
  { name: "oats", type: PlantType.Grains },
  { name: "quinoa", type: PlantType.Grains },
  { name: "barley", type: PlantType.Grains },
  { name: "corn", type: PlantType.Grains },
  // Legumes
  { name: "lentils", type: PlantType.Legumes },
  { name: "chickpeas", type: PlantType.Legumes },
  { name: "black beans", type: PlantType.Legumes },
  { name: "soybeans", type: PlantType.Legumes },
  { name: "green peas", type: PlantType.Legumes },
  // NutsAndSeeds
  { name: "almonds", type: PlantType.NutsAndSeeds },
  { name: "walnuts", type: PlantType.NutsAndSeeds },
  { name: "sunflower seeds", type: PlantType.NutsAndSeeds },
  { name: "chia seeds", type: PlantType.NutsAndSeeds },
  { name: "flaxseeds", type: PlantType.NutsAndSeeds },
  // HerbsAndSpices
  { name: "basil", type: PlantType.HerbsAndSpices },
  { name: "oregano", type: PlantType.HerbsAndSpices },
  { name: "turmeric", type: PlantType.HerbsAndSpices },
  { name: "ginger", type: PlantType.HerbsAndSpices },
  { name: "cinnamon", type: PlantType.HerbsAndSpices },
];

function daysAgo(n: number): Date {
  const d = new Date("2026-04-21");
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  await prisma.plantIntake.deleteMany();
  await prisma.plant.deleteMany();

  await prisma.plant.createMany({ data: plants });

  const created = await prisma.plant.findMany();
  const byName = Object.fromEntries(created.map((p: { name: string; id: number }) => [p.name, p.id]));

  const intakes: { plantId: number; date: Date }[] = [
    // Week of Apr 21 (current week)
    { plantId: byName["oats"], date: daysAgo(0) },
    { plantId: byName["banana"], date: daysAgo(0) },
    { plantId: byName["almonds"], date: daysAgo(0) },
    { plantId: byName["spinach"], date: daysAgo(0) },
    { plantId: byName["lentils"], date: daysAgo(0) },
    { plantId: byName["rice"], date: daysAgo(1) },
    { plantId: byName["tomato"], date: daysAgo(1) },
    { plantId: byName["apple"], date: daysAgo(1) },
    { plantId: byName["basil"], date: daysAgo(1) },
    { plantId: byName["chickpeas"], date: daysAgo(2) },
    { plantId: byName["broccoli"], date: daysAgo(2) },
    { plantId: byName["blueberry"], date: daysAgo(2) },
    { plantId: byName["chia seeds"], date: daysAgo(2) },
    { plantId: byName["quinoa"], date: daysAgo(3) },
    { plantId: byName["carrot"], date: daysAgo(3) },
    { plantId: byName["orange"], date: daysAgo(3) },
    { plantId: byName["turmeric"], date: daysAgo(3) },
    { plantId: byName["walnuts"], date: daysAgo(4) },
    { plantId: byName["green peas"], date: daysAgo(4) },
    { plantId: byName["mango"], date: daysAgo(4) },
    // Week of Apr 14
    { plantId: byName["oats"], date: daysAgo(7) },
    { plantId: byName["strawberry"], date: daysAgo(7) },
    { plantId: byName["flaxseeds"], date: daysAgo(7) },
    { plantId: byName["corn"], date: daysAgo(8) },
    { plantId: byName["tomato"], date: daysAgo(8) },
    { plantId: byName["ginger"], date: daysAgo(8) },
    { plantId: byName["black beans"], date: daysAgo(9) },
    { plantId: byName["spinach"], date: daysAgo(9) },
    { plantId: byName["apple"], date: daysAgo(9) },
    { plantId: byName["almonds"], date: daysAgo(10) },
    { plantId: byName["barley"], date: daysAgo(10) },
    { plantId: byName["cucumber"], date: daysAgo(10) },
    { plantId: byName["grapes"], date: daysAgo(11) },
    { plantId: byName["lentils"], date: daysAgo(11) },
    { plantId: byName["oregano"], date: daysAgo(11) },
    { plantId: byName["rice"], date: daysAgo(12) },
    { plantId: byName["bell pepper"], date: daysAgo(12) },
    { plantId: byName["banana"], date: daysAgo(12) },
    { plantId: byName["sunflower seeds"], date: daysAgo(13) },
    { plantId: byName["soybeans"], date: daysAgo(13) },
    // Week of Apr 7
    { plantId: byName["oats"], date: daysAgo(14) },
    { plantId: byName["blueberry"], date: daysAgo(14) },
    { plantId: byName["chia seeds"], date: daysAgo(14) },
    { plantId: byName["broccoli"], date: daysAgo(15) },
    { plantId: byName["chickpeas"], date: daysAgo(15) },
    { plantId: byName["mango"], date: daysAgo(15) },
    { plantId: byName["turmeric"], date: daysAgo(16) },
    { plantId: byName["quinoa"], date: daysAgo(16) },
    { plantId: byName["carrot"], date: daysAgo(16) },
    { plantId: byName["walnuts"], date: daysAgo(17) },
    { plantId: byName["orange"], date: daysAgo(17) },
    { plantId: byName["tomato"], date: daysAgo(17) },
    { plantId: byName["green peas"], date: daysAgo(18) },
    { plantId: byName["rice"], date: daysAgo(18) },
    { plantId: byName["strawberry"], date: daysAgo(19) },
    { plantId: byName["basil"], date: daysAgo(19) },
    { plantId: byName["zucchini"], date: daysAgo(20) },
    { plantId: byName["almonds"], date: daysAgo(20) },
    // Week of Mar 31
    { plantId: byName["oats"], date: daysAgo(21) },
    { plantId: byName["banana"], date: daysAgo(21) },
    { plantId: byName["lentils"], date: daysAgo(21) },
    { plantId: byName["spinach"], date: daysAgo(22) },
    { plantId: byName["apple"], date: daysAgo(22) },
    { plantId: byName["ginger"], date: daysAgo(22) },
    { plantId: byName["corn"], date: daysAgo(23) },
    { plantId: byName["grapes"], date: daysAgo(23) },
    { plantId: byName["flaxseeds"], date: daysAgo(23) },
    { plantId: byName["bell pepper"], date: daysAgo(24) },
    { plantId: byName["soybeans"], date: daysAgo(24) },
    { plantId: byName["blueberry"], date: daysAgo(24) },
    { plantId: byName["barley"], date: daysAgo(25) },
    { plantId: byName["cucumber"], date: daysAgo(25) },
    { plantId: byName["cinnamon"], date: daysAgo(25) },
    { plantId: byName["black beans"], date: daysAgo(26) },
    { plantId: byName["mango"], date: daysAgo(26) },
    { plantId: byName["sunflower seeds"], date: daysAgo(27) },
    { plantId: byName["broccoli"], date: daysAgo(27) },
  ];

  await prisma.plantIntake.createMany({ data: intakes });

  console.log(`Seeded ${plants.length} plants and ${intakes.length} intakes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
