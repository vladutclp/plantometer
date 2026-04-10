"use client";

import { useActionState, useState } from "react";
import { createPlant } from "@/app/plant-actions";

const PLANT_TYPES = [
  { value: "Vegetables", label: "Vegetables" },
  { value: "Fruits", label: "Fruits" },
  { value: "Grains", label: "Grains" },
  { value: "Legumes", label: "Legumes" },
  { value: "NutsAndSeeds", label: "Nuts & Seeds" },
  { value: "HerbsAndSpices", label: "Herbs & Spices" },
];

export function AddPlantInline() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createPlant, null);

  if (state !== null && !state.error && open) {
    setOpen(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost flex items-center gap-1 text-sm"
      >
        <span className="text-base leading-none">{open ? "−" : "+"}</span>
        {open ? "Cancel" : "Add a new plant"}
      </button>

      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-stone-700">
              Plant name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Broccoli"
              required
              autoFocus
              className="input w-full text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-stone-700">
              Type
            </label>
            <select
              name="type"
              className="input w-full text-sm bg-white"
            >
              {PLANT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          {state?.error && (
            <p className="text-error text-xs">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary"
          >
            {isPending ? "Saving…" : "Save plant"}
          </button>
        </form>
      )}
    </div>
  );
}
