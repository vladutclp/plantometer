import prisma from "@/lib/prisma";
import { createPlant } from "@/app/plant-actions";
import { AddPlantForm } from "./add-plant-form";
import { PlantRow } from "./plant-row";

export const dynamic = "force-dynamic";

export default async function Plants() {
  const plants = await prisma.plant.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="max-w-xl mx-auto px-5 sm:px-6 pt-8 pb-16 flex flex-col gap-8">
      <section>
        <h1 className="mb-5">Your Plants</h1>
        <div className="card p-5">
          <h2 className="mb-4">Add a plant</h2>
          <AddPlantForm action={createPlant} />
        </div>
      </section>

      <section>
        <h2 className="mb-3">
          Catalog{" "}
          <span className="text-stone-400 font-normal text-sm">
            ({plants.length})
          </span>
        </h2>
        {plants.length === 0 ? (
          <p className="text-stone-400 text-sm">No plants yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {plants.map((plant) => (
              <PlantRow key={plant.id} plant={plant} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
