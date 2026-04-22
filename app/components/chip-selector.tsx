"use client";

import { useActionState, useState } from "react";
import { logMultipleIntakes } from "@/app/intake-actions";

type Plant = {
  id: number;
  name: string;
  type: string | null;
};

export function ChipSelector({
  plants,
  todayStr,
}: {
  plants: Plant[];
  todayStr: string;
}) {
  const [selected, setSelected] = useState(new Set<number>());
  const [search, setSearch] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(todayStr);

  const [state, formAction, isPending] = useActionState(
    logMultipleIntakes,
    null,
  );

  // Reset selections after a successful log.
  // Calling setState during render (not in an effect) is the React-recommended
  // pattern for derived state — React re-renders immediately without painting
  // the intermediate state, and the condition prevents infinite loops.
  const [lastOkState, setLastOkState] = useState<typeof state>(null);
  if (state?.ok && lastOkState !== state) {
    setLastOkState(state);
    setSelected(new Set());
    setSearch("");
    setShowDate(false);
    setDate(todayStr);
  }

  const filtered = search
    ? plants.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : plants;

  const toggle = (id: number) => {
    setSelected((prev) => {
      console.log("prev: ", prev, typeof prev);
      const next = new Set(prev);
      console.log("next: ", next);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSearchInput = () => setSearch("");

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search plants…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full"
        />
        {search.length > 0 && (
          <button
            onClick={clearSearchInput}
            className="ml-1 text-2xl opacity-70 absolute right-4 top-1"
          >
            ×
          </button>
        )}
      </div>
      {/* Chips */}
      {filtered.length === 0 ? (
        <p className="text-stone-400 text-sm py-2">
          No plants match your search.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`chip ${selected.has(p.id) ? "chip-active" : "chip-default"}`}
            >
              {p.name}
              {selected.has(p.id) && (
                <span className="ml-1 text-lg opacity-70">×</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Hidden inputs for selected plant IDs */}
      {Array.from(selected).map((id) => (
        <input key={id} type="hidden" name="plantId" value={id} />
      ))}

      {/* Date — hidden by default, shown on toggle */}
      {showDate ? (
        <input
          type="date"
          name="date"
          value={date}
          max={todayStr}
          onChange={(e) => setDate(e.target.value)}
          className="input w-full"
        />
      ) : (
        <input type="hidden" name="date" value={todayStr} />
      )}

      {/* Submit — animated in when something is selected */}
      <div
        className={`transition-all duration-150 overflow-hidden ${
          selected.size > 0
            ? "opacity-100 translate-y-0 max-h-16"
            : "opacity-0 translate-y-1 max-h-0"
        }`}
      >
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full"
        >
          {isPending
            ? "Logging…"
            : `Log ${selected.size} plant${selected.size !== 1 ? "s" : ""}`}
        </button>
      </div>

      {/* Date toggle */}
      <button
        type="button"
        onClick={() => setShowDate((v) => !v)}
        className="btn-ghost text-xs text-left"
      >
        {showDate ? "← Log for today" : "Log for a different day →"}
      </button>
    </form>
  );
}
