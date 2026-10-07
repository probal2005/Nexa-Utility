export const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonthDays =
    startDay === 0
      ? 0
      : new Date(year, month, 0).getDate();

  const days: Date[] = [];

  for (let i = startDay - 1; i >= 0; i -= 1) {
    days.push(new Date(year, month - 1, previousMonthDays - i));
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  const remaining = 42 - days.length;

  for (let day = 1; day <= remaining; day += 1) {
    days.push(new Date(year, month + 1, day));
  }

  return days;
}

export function isSameDay(a: Date, b: Date): boolean {
  return formatDateKey(a) === formatDateKey(b);
}

export function formatMonthTitle(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatSelectedDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
