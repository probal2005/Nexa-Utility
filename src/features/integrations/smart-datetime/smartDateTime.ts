export type ParsedDateTime = {
  dueDate?: string;
  dueTime?: string;
};

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const MONTHS: Record<string, number> = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sep: 8,
  sept: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDate(date: Date): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-");
}

function formatTime(
  hours: number,
  minutes: number,
): string {
  return `${pad(hours)}:${pad(minutes)}`;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[,\u2013\u2014]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTime(
  text: string,
): string | undefined {
  const twelveHourMatch = text.match(
    /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i,
  );

  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = Number(
      twelveHourMatch[2] ?? "0",
    );

    const meridiem =
      twelveHourMatch[3].toLowerCase();

    if (
      hours < 1 ||
      hours > 12 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return undefined;
    }

    if (meridiem === "am") {
      if (hours === 12) {
        hours = 0;
      }
    } else if (hours !== 12) {
      hours += 12;
    }

    return formatTime(hours, minutes);
  }

  const twentyFourHourMatch = text.match(
    /\bat\s+([01]?\d|2[0-3]):([0-5]\d)\b/,
  );

  if (twentyFourHourMatch) {
    return formatTime(
      Number(twentyFourHourMatch[1]),
      Number(twentyFourHourMatch[2]),
    );
  }

  return undefined;
}

function parseRelativeDate(
  text: string,
  now: Date,
): Date | undefined {
  if (/\bday after tomorrow\b/.test(text)) {
    const date = new Date(now);
    date.setDate(date.getDate() + 2);
    return date;
  }

  if (/\btomorrow\b/.test(text)) {
    const date = new Date(now);
    date.setDate(date.getDate() + 1);
    return date;
  }

  if (/\btoday\b/.test(text)) {
    return new Date(now);
  }

  const nextWeekdayMatch = text.match(
    /\bnext\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/,
  );

  if (nextWeekdayMatch) {
    const targetDay = WEEKDAYS.indexOf(
      nextWeekdayMatch[1],
    );

    const currentDay = now.getDay();

    let daysUntil =
      (targetDay - currentDay + 7) % 7;

    if (daysUntil === 0) {
      daysUntil = 7;
    }

    const date = new Date(now);
    date.setDate(
      date.getDate() + daysUntil,
    );

    return date;
  }

  return undefined;
}

function parseNumericDate(
  text: string,
  now: Date,
): Date | undefined {
  const match = text.match(
    /\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{4}))?\b/,
  );

  if (!match) {
    return undefined;
  }

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;

  const year = match[3]
    ? Number(match[3])
    : now.getFullYear();

  if (
    month < 0 ||
    month > 11 ||
    day < 1 ||
    day > 31
  ) {
    return undefined;
  }

  const date = new Date(
    year,
    month,
    day,
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  if (
    !match[3] &&
    date.getTime() < new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime()
  ) {
    date.setFullYear(
      date.getFullYear() + 1,
    );
  }

  return date;
}

function parseMonthDate(
  text: string,
  now: Date,
): Date | undefined {
  const match = text.match(
    /\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\b/i,
  );

  if (!match) {
    return undefined;
  }

  const day = Number(match[1]);
  const monthName =
    match[2].toLowerCase();

  const month = MONTHS[monthName];

  if (
    month === undefined ||
    day < 1 ||
    day > 31
  ) {
    return undefined;
  }

  let year = now.getFullYear();

  let date = new Date(
    year,
    month,
    day,
  );

  if (
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (date.getTime() < today.getTime()) {
    year += 1;

    date = new Date(
      year,
      month,
      day,
    );
  }

  return date;
}

export function parseSmartDateTime(
  text: string,
  now = new Date(),
): ParsedDateTime {
  const normalized = normalizeText(text);

  if (!normalized) {
    return {};
  }

  const dueTime =
    parseTime(normalized);

  const dueDateObject =
    parseRelativeDate(
      normalized,
      now,
    ) ??
    parseNumericDate(
      normalized,
      now,
    ) ??
    parseMonthDate(
      normalized,
      now,
    );

  return {
    dueDate: dueDateObject
      ? formatDate(dueDateObject)
      : undefined,
    dueTime,
  };
}
