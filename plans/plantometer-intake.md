# Plan: Plantometer Intake Tracking

> Source PRD: Plantometer — track weekly plant diversity (Mon–Sun)

## Architectural Decisions

- **Routes**: `/` — home (weekly summary + log intake), `/plants` — plant catalog management
- **Schema**: `Plant` (catalog) + `PlantIntake` (intake log with `plantId` FK + `date`)
- **Key models**: `Plant`, `PlantIntake`, `PlantType` enum
- **Auth**: Single-user, no auth for now. Schema kept auth-neutral (no userId) to avoid migration friction later.
- **Week boundary**: Monday–Sunday, computed server-side in UTC
- **Data mutations**: Next.js Server Actions with `revalidatePath`
- **Styling**: Tailwind CSS 4

---

## Phase 1: Schema Foundation

**User stories**: 7, 8, 11

### What to build

Rename the `Cereals` enum value to `Grains` and add the `PlantIntake` model via Prisma migrations. Update the plant catalog UI to reflect the renamed type. No new pages — this is purely schema + catalog cleanup.

### Acceptance criteria

- [ ] `PlantType` enum has `Grains` instead of `Cereals`
- [ ] `PlantIntake` table exists with `id`, `plantId` (FK → Plant), `date` (DateTime)
- [ ] Plant catalog page shows "Grains" in the type dropdown and plant list
- [ ] Existing plant records with type `Cereals` are migrated to `Grains`
- [ ] `npx prisma migrate dev` runs cleanly

---

## Phase 2: Log Today's Intake

**User stories**: 5, 10

### What to build

Redesign the home page (`/`) to show a plant selector + log button (date defaults to today). On submit, create a `PlantIntake` record. Show a simple list of today's logged plants below the form.

### Acceptance criteria

- [ ] Home page has a dropdown of plants from the catalog and a "Log" button
- [ ] Submitting logs an intake entry for today
- [ ] Today's logged plants appear on the page after submission
- [ ] Duplicate plant logs on the same day are allowed (diversity is deduped at query time)

---

## Phase 3: Weekly Diversity Summary

**User stories**: 1, 2, 3, 4, 9, 12

### What to build

Compute and display the current Mon–Sun week summary on the home screen: diversity score (X/6 types covered), a checklist of types (✓/✗), and individual plants eaten grouped under each type.

### Acceptance criteria

- [ ] Home page shows "X/6 plant types" score for the current week
- [ ] Each plant type shows ✓ or ✗ depending on whether it was eaten this week
- [ ] Individual plants are listed under their type
- [ ] The same plant logged on multiple days counts as 1 toward the diversity count

---

## Phase 4: Past Day Logging + Remove Entry

**User stories**: 6, 13

### What to build

Add a date picker to the log form (defaults to today). Add a remove button next to each logged intake entry.

### Acceptance criteria

- [ ] Log form has a date field defaulting to today
- [ ] User can backfill intakes for past days
- [ ] Each intake entry has a remove button that deletes it
- [ ] Weekly summary updates correctly after removal

---

## Phase 5: Week Navigation

**User stories**: 14

### What to build

Add prev/next week arrows to the home screen. The summary re-fetches for the selected week. Current week is the default.

### Acceptance criteria

- [ ] Prev/Next buttons navigate between weeks
- [ ] Summary reflects the selected week's data
- [ ] Current week is shown by default on page load
