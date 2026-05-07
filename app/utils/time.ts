export const DEFAULT_TZ = "America/St_Kitts";

export function getWeekStart(date: Date): Date {
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() + diff);
  return monday;
}

export function parseWeekParam(param: string | undefined, today: Date): Date {
  if (param) {
    const [y, m, d] = param.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    if (!isNaN(date.getTime()) && date.getUTCDay() === 1) return date;
  }
  return getWeekStart(today);
}

export function toDateParam(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function toDateTimeInTZ(d: Date, timeZone = DEFAULT_TZ): string {
  return d.toLocaleString("en-CA", { timeZone, hour12: false }).replace(", ", " ");
}

export function todayInTZ(timeZone: string): Date {
  const dateStr = new Date().toLocaleDateString("en-CA", { timeZone });
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
