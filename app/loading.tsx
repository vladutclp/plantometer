export default function Loading() {
  return (
    <main className="max-w-xl mx-auto px-5 sm:px-6 pt-8 pb-16 flex flex-col gap-8 animate-pulse">
      {/* Week nav */}
      <div className="flex items-center justify-between h-10">
        <div className="w-8 h-8 rounded-md bg-stone-100" />
        <div className="flex flex-col items-center gap-1">
          <div className="w-20 h-4 rounded bg-stone-100" />
          <div className="w-28 h-3 rounded bg-stone-100" />
        </div>
        <div className="w-8 h-8 rounded-md bg-stone-100" />
      </div>

      {/* Score card */}
      <div className="rounded-xl bg-sprout-50/60 border border-sprout-100 h-30" />

      {/* Type checklist */}
      <section>
        <div className="w-32 h-4 rounded bg-stone-100 mb-3" />
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="rounded-md bg-stone-100 h-14"
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
