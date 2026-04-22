"use client";

import { useActionState, useState } from "react";
import { updatePlant, deletePlant } from "@/app/plant-actions";

const PLANT_TYPES = [
  { value: "Vegetables", label: "Vegetables" },
  { value: "Fruits", label: "Fruits" },
  { value: "Grains", label: "Grains" },
  { value: "Legumes", label: "Legumes" },
  { value: "NutsAndSeeds", label: "Nuts & Seeds" },
  { value: "HerbsAndSpices", label: "Herbs & Spices" },
];

const TYPE_LABELS: Record<string, string> = {
  Vegetables: "Vegetables",
  Fruits: "Fruits",
  Grains: "Grains",
  Legumes: "Legumes",
  NutsAndSeeds: "Nuts & Seeds",
  HerbsAndSpices: "Herbs & Spices",
};

const TYPE_COLORS: Record<string, string> = {
  Vegetables: "#72c441",
  Fruits: "#f59e0b",
  Grains: "#d4a853",
  Legumes: "#7cb87a",
  NutsAndSeeds: "#b58a4a",
  HerbsAndSpices: "#8b5cf6",
};

type Plant = {
  id: number;
  name: string;
  type: string | null;
};

export function PlantRow({ plant }: { plant: Plant }) {
  const [editing, setEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updateState, updateAction, isUpdating] = useActionState(
    updatePlant,
    null,
  );

  if (updateState !== null && !updateState.error && editing) {
    setEditing(false);
  }

  async function handleDelete() {
    setDeleteError(null);
    const result = await deletePlant(plant.id);
    if (result.error) setDeleteError(result.error);
  }

  if (editing) {
    return (
      <li className="flex flex-col gap-3 bg-white border border-stone-200 rounded-md shadow-xs px-4 py-3">
        <form action={updateAction} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={plant.id} />
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-stone-700">
              Plant name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={plant.name}
              required
              autoFocus
              className="input w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-stone-700">
              Type
            </label>
            <select
              name="type"
              defaultValue={plant.type ?? "Vegetables"}
              className="input w-full text-sm bg-white"
            >
              {PLANT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          {updateState?.error && (
            <p className="text-error text-xs">{updateState.error}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="btn-primary flex-1 h-9 text-sm"
            >
              {isUpdating ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-secondary flex-1 h-9 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-1 bg-white border border-stone-200 rounded-md shadow-xs px-4 py-3 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {plant.type && (
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: TYPE_COLORS[plant.type] }}
            />
          )}
          <span className="font-medium text-stone-800">{plant.name}</span>
          {plant.type && (
            <span className="text-stone-400 text-xs">
              {TYPE_LABELS[plant.type] ?? plant.type}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-stone-400 hover:text-stone-700 text-xs transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-stone-400 hover:text-error text-base leading-none transition-colors"
            aria-label="Delete plant"
          >
            ×
          </button>
        </div>
      </div>
      {deleteError && <p className="text-error text-xs mt-1">{deleteError}</p>}
    </li>
  );
}
