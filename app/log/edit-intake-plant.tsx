"use client";

import { useState, useTransition } from "react";
import { updateIntakePlant } from "./actions";

type Plant = { id: number; name: string };

export function EditIntakePlant({
  intakeId,
  currentPlantId,
  plants,
}: {
  intakeId: number;
  currentPlantId: number;
  plants: Plant[];
}) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newPlantId = parseInt(e.target.value);
    startTransition(async () => {
      await updateIntakePlant(intakeId, newPlantId);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <select
        autoFocus
        defaultValue={currentPlantId}
        onChange={handleChange}
        disabled={isPending}
        onBlur={() => setEditing(false)}
        className="border border-stone-200 bg-white text-stone-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-sprout-400"
        style={{ boxShadow: "0 0 0 3px rgba(87,176,43,0.15)" }}
      >
        {plants.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="text-stone-400 hover:text-stone-700 text-xs transition-colors"
    >
      Edit
    </button>
  );
}
