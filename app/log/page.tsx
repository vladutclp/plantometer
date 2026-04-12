import prisma from "@/lib/prisma";
import { PlantType } from "@/app/generated/prisma/enums";
import { removeIntake } from "@/app/intake-actions";
import { EditIntakePlant } from "./edit-intake-plant";
import Link from "next/link";

const TYPE_LABELS: Record<PlantType, string> = {
  Vegetables: "Vegetables",
  Fruits: "Fruits",
  Grains: "Grains",
  Legumes: "Legumes",
  NutsAndSeeds: "Nuts & Seeds",
  HerbsAndSpices: "Herbs & Spices",
};

const TYPE_COLORS: Record<PlantType, string> = {
  Vegetables: "#72c441",
  Fruits: "#f59e0b",
  Grains: "#d4a853",
  Legumes: "#7cb87a",
  NutsAndSeeds: "#b58a4a",
  HerbsAndSpices: "#8b5cf6",
};

export const dynamic = "force-dynamic";

export default async function LogHistory() {
  const [intakes, plants] = await Promise.all([
    prisma.plantIntake.findMany({
      include: { plant: true },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    }),
    prisma.plant.findMany({ orderBy: { name: "asc" } }),
  ]);

  const groups = new Map<string, typeof intakes>();
  for (const intake of intakes) {
    const dateStr = new Date(intake.date).toISOString().split("T")[0];
    if (!groups.has(dateStr)) groups.set(dateStr, []);
    groups.get(dateStr)!.push(intake);
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00Z");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <main className="max-w-xl mx-auto px-5 sm:px-6 pt-8 pb-16">
      <h1 className="mb-6">
        Log history{" "}
        <span className="text-stone-400 font-normal text-sm font-body">
          ({intakes.length} entries)
        </span>
      </h1>

      {intakes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-stone-200"
          >
            <path
              d="M24 4C24 4 12 14 12 26C12 32.627 17.373 38 24 38C30.627 38 36 32.627 36 26C36 14 24 4 24 4Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M24 38V44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M24 20C24 20 18 24 18 28"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <h2 className="text-stone-400">No entries yet</h2>
          <Link href="/" className="btn-primary inline-flex items-center px-5 h-11 rounded-md text-sm font-semibold">
            Start logging
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Array.from(groups.entries()).map(([dateStr, entries]) => (
            <section key={dateStr}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-500 mb-2 sticky top-15 bg-stone-0/90 backdrop-blur-sm py-1">
                {formatDate(dateStr)}
              </p>
              <ul className="flex flex-col gap-2">
                {entries.map((intake) => (
                  <li
                    key={intake.id}
                    className="flex items-center justify-between bg-white border border-stone-100 rounded-md shadow-xs px-4 py-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {intake.plant.type && (
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              TYPE_COLORS[intake.plant.type as PlantType],
                          }}
                        />
                      )}
                      <span className="font-medium text-stone-800 truncate">
                        {intake.plant.name}
                      </span>
                      {intake.plant.type && (
                        <span className="text-stone-400 text-xs shrink-0">
                          {TYPE_LABELS[intake.plant.type as PlantType]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <EditIntakePlant
                        intakeId={intake.id}
                        currentPlantId={intake.plantId}
                        plants={plants}
                      />
                      <form action={removeIntake}>
                        <input
                          type="hidden"
                          name="intakeId"
                          value={intake.id}
                        />
                        <button
                          type="submit"
                          className="text-stone-400 hover:text-error text-base leading-none px-1 transition-colors"
                          aria-label="Delete entry"
                        >
                          ×
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
