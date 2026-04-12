import prisma from "@/lib/prisma";
import { PlantType } from "./generated/prisma/enums";
import Link from "next/link";
import { ChipSelector } from "./components/chip-selector";
import { AddPlantInline } from "./components/add-plant-inline";
import { removeIntake } from "./intake-actions";

// ── Date helpers ────────────────────────────────────────────────────────────

function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function getWeekStart(date: Date): Date {
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() + diff);
  return monday;
}

function parseWeekParam(param: string | undefined, today: Date): Date {
  if (param) {
    const [y, m, d] = param.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    if (!isNaN(date.getTime()) && date.getUTCDay() === 1) return date;
  }
  return getWeekStart(today);
}

function toDateParam(d: Date): string {
  return d.toISOString().split("T")[0];
}

// ── Display helpers ─────────────────────────────────────────────────────────

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

const ALL_TYPES = Object.values(PlantType);

// ── Page ────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const today = todayUTC();
  const todayStr = toDateParam(today);

  const currentWeekStart = getWeekStart(today);
  const weekStart = parseWeekParam(week, today);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

  const isCurrentWeek = weekStart.getTime() === currentWeekStart.getTime();

  const prevWeekParam = toDateParam(
    new Date(
      Date.UTC(
        weekStart.getUTCFullYear(),
        weekStart.getUTCMonth(),
        weekStart.getUTCDate() - 7,
      ),
    ),
  );
  const nextWeekParam = toDateParam(
    new Date(
      Date.UTC(
        weekStart.getUTCFullYear(),
        weekStart.getUTCMonth(),
        weekStart.getUTCDate() + 7,
      ),
    ),
  );

  const [plants, weekIntakes] = await Promise.all([
    prisma.plant.findMany({ orderBy: { name: "asc" } }),
    prisma.plantIntake.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      include: { plant: true },
      orderBy: { id: "desc" },
    }),
  ]);

  // Weekly summary: deduplicate by plant, group by type
  const seenPlantIds = new Set<number>();
  const plantsByType: Partial<
    Record<PlantType, { id: number; name: string }[]>
  > = {};

  for (const intake of weekIntakes) {
    if (seenPlantIds.has(intake.plantId)) continue;
    seenPlantIds.add(intake.plantId);
    const type = intake.plant.type as PlantType | null;
    if (!type) continue;
    if (!plantsByType[type]) plantsByType[type] = [];
    plantsByType[type]!.push({ id: intake.plant.id, name: intake.plant.name });
  }

  const uniqueTypeCount = Object.keys(plantsByType).length;
  const uniquePlantCount = seenPlantIds.size;
  const progressPct = Math.round((uniqueTypeCount / ALL_TYPES.length) * 100);
  const isComplete = uniqueTypeCount === ALL_TYPES.length;

  // Today's intakes — only relevant when viewing the current week
  const todayIntakes = isCurrentWeek
    ? weekIntakes.filter(
        (i) => new Date(i.date).toISOString().split("T")[0] === todayStr,
      )
    : [];

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  const weekLabel = `${fmt(weekStart)} – ${fmt(weekEnd)}`;

  return (
    <main className="max-w-xl mx-auto px-5 sm:px-6 pt-8 pb-16 flex flex-col gap-8">
      {/* Week nav */}
      <div className="flex items-center justify-between h-10">
        <Link
          href={`/?week=${prevWeekParam}`}
          className="w-8 h-8 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors text-lg leading-none"
          aria-label="Previous week"
        >
          ←
        </Link>
        <div className="text-center">
          <p className="font-heading font-semibold text-stone-800 text-sm">
            {isCurrentWeek ? "This week" : "Week of"}
          </p>
          <p className="text-stone-400 text-xs">{weekLabel}</p>
        </div>
        {isCurrentWeek ? (
          <span className="w-8" />
        ) : (
          <Link
            href={
              nextWeekParam === toDateParam(currentWeekStart)
                ? "/"
                : `/?week=${nextWeekParam}`
            }
            className="w-8 h-8 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors text-lg leading-none"
            aria-label="Next week"
          >
            →
          </Link>
        )}
      </div>

      {/* Score card */}
      <div
        className={`rounded-xl p-6 shadow-md transition-all ${
          isComplete
            ? "bg-sprout-100 border-2 border-sprout-400"
            : uniqueTypeCount === 0
              ? "bg-stone-100 border border-stone-300"
              : "bg-sprout-50 border border-sprout-200"
        }`}
        style={
          isComplete
            ? { outline: "2px dashed #72c441", outlineOffset: "4px" }
            : undefined
        }
      >
        <div className="flex items-end gap-3">
          <span className="font-heading text-[72px] font-extrabold text-sprout-600 leading-none tracking-[-0.03em]">
            {uniqueTypeCount}
          </span>
          <div className="text-sm text-stone-600 mb-2">
            <p>/ {ALL_TYPES.length} types</p>
            <p>
              {uniquePlantCount} unique plant{uniquePlantCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="mt-4 h-1.5 bg-sprout-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-sprout-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Type checklist */}
      <section>
        <h3 className="mb-3 text-stone-500">Plant types this week</h3>
        <ul className="flex flex-col gap-2">
          {ALL_TYPES.map((type) => {
            const eaten = plantsByType[type];
            return (
              <li
                key={type}
                className={`check-item ${eaten ? "check-item-on" : "check-item-off"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Indicator circle */}
                    {eaten ? (
                      <div className="w-5 h-5 rounded-full bg-sprout-500 flex items-center justify-center shrink-0">
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full border-2 border-stone-300 shrink-0"
                        style={{ borderColor: TYPE_COLORS[type] + "66" }}
                      />
                    )}
                    <div>
                      <p
                        className={
                          eaten
                            ? "font-heading font-semibold text-stone-800 text-sm"
                            : "font-body font-medium text-stone-500 text-sm"
                        }
                      >
                        {TYPE_LABELS[type]}
                      </p>
                      {eaten && (
                        <p className="text-[12px] text-sprout-700 mt-0.5">
                          {eaten.map((p) => p.name).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                    />
                    {eaten && (
                      <span className="text-[12px] font-medium text-sprout-600 bg-sprout-100 px-2 py-0.5 rounded-full">
                        {eaten.length}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Log intake — current week only */}
      {isCurrentWeek && (
        <section>
          <div className="card p-5">
            <h2 className="mb-4">Log plants</h2>
            {plants.length === 0 ? (
              <p className="text-stone-500 text-sm">
                No plants in your catalog yet.{" "}
                <Link href="/plants" className="text-sprout-600 underline">
                  Add some first.
                </Link>
              </p>
            ) : (
              <ChipSelector plants={plants} todayStr={todayStr} />
            )}
            <div className="mt-4 pt-4 border-t border-stone-200">
              <AddPlantInline />
            </div>
          </div>
        </section>
      )}

      {/* Today's entries — current week only */}
      {isCurrentWeek && (
        <section>
          <h2 className="mb-3">
            Today&apos;s entries{" "}
            <span className="text-stone-400 font-normal text-sm">
              ({todayIntakes.length})
            </span>
          </h2>
          {todayIntakes.length === 0 ? (
            <p className="text-stone-400 text-sm">Nothing logged yet today.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {todayIntakes.map((intake) => (
                <li
                  key={intake.id}
                  className="flex items-center justify-between bg-white border border-stone-200 rounded-md shadow-xs px-4 py-2.5 text-sm"
                >
                  <div className="flex items-center gap-3">
                    {intake.plant.type && (
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            TYPE_COLORS[intake.plant.type as PlantType],
                        }}
                      />
                    )}
                    <span className="font-medium text-stone-800">
                      {intake.plant.name}
                    </span>
                    {intake.plant.type && (
                      <span className="text-stone-400 text-xs">
                        {TYPE_LABELS[intake.plant.type as PlantType]}
                      </span>
                    )}
                  </div>
                  <form action={removeIntake}>
                    <input type="hidden" name="intakeId" value={intake.id} />
                    <button
                      type="submit"
                      className="text-stone-400 hover:text-error text-base leading-none px-1 transition-colors"
                      aria-label="Remove entry"
                    >
                      ×
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
