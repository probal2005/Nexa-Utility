const SMALL_NUMBERS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const NUMBER_WORDS = [
  ...Object.keys(SMALL_NUMBERS),
  ...Object.keys(TENS),
  'hundred',
  'thousand',
  'and',
].join('|');

function parseNumberWords(phrase: string): number {
  let total = 0;
  let current = 0;

  for (const word of phrase.toLowerCase().split(/[\s-]+/)) {
    if (word === 'and') continue;
    if (word in SMALL_NUMBERS) {
      current += SMALL_NUMBERS[word];
    } else if (word in TENS) {
      current += TENS[word];
    } else if (word === 'hundred') {
      current = Math.max(current, 1) * 100;
    } else if (word === 'thousand') {
      total += Math.max(current, 1) * 1000;
      current = 0;
    }
  }

  return total + current;
}

export function normalizeSpokenNumbers(text: string): string {
  const numberPhrase = new RegExp(
    `\\b(?:${NUMBER_WORDS})(?:[\\s-]+(?:${NUMBER_WORDS}))*\\b`,
    'gi',
  );

  return text.replace(numberPhrase, (phrase) => String(parseNumberWords(phrase)));
}

function normalizeSpokenMath(text: string): string {
  return text
    .replace(/multiplied\s+by|times/gi, '*')
    .replace(/divided\s+by|over/gi, '/')
    .replace(/plus/gi, '+')
    .replace(/minus/gi, '-')
    .replace(/percent/gi, '%')
    .replace(/\bpoint\b/gi, '.')
    .replace(/[?=]/g, ' ')
    .trim();
}

function normalizeCommand(text: string): string {
  let normalized = normalizeSpokenNumbers(text)
    .replace(/^[,\s]*(?:please\s+)?/i, '')
    .replace(/[?!.,]+$/g, '')
    .replace(/\s+(?:please|thanks|thank you)$/i, '')
    .trim();

  normalized = normalized.replace(
    /^(?:can|could|would) you\s+/i,
    '',
  );

  const openMatch = normalized.match(
    /^(?:open|launch|show|go to|take me to|bring up|switch to)\s+(?:the|my)\s+(.+)$/i,
  );
  if (openMatch) return `open ${openMatch[1]}`;

  const needMatch = normalized.match(
    /^(?:i need|i want|bring me)\s+(?:the|my)\s+(.+)$/i,
  );
  if (needMatch) return `open ${needMatch[1]}`;

  const timerMatch = normalized.match(
    /^(?:set|start|begin|run)\s+(?:a\s+)?(?:countdown|timer)(?:\s+(?:for|in|of))?\s+(.+)$/i,
  );
  if (timerMatch) return `timer ${timerMatch[1]}`;

  const countdownMatch = normalized.match(
    /^count\s+down\s+(?:from|for)\s+(.+)$/i,
  );
  if (countdownMatch) return `timer ${countdownMatch[1]}`;

  const mathLead = normalized.match(
    /^(?:what is|what's|what is the result of|how much is|calculate|compute|solve)\s+(.+)$/i,
  );
  if (mathLead) {
    const expression = normalizeSpokenMath(normalizeSpokenNumbers(mathLead[1]));
    if (/^[0-9+\-*/().\s×÷−%]+$/.test(expression) && /[0-9]/.test(expression) && /[+\-*/×÷−%]/.test(expression)) {
      return `calculate ${expression}`;
    }
  }

  const casualMath = normalizeSpokenMath(normalizeSpokenNumbers(normalized));
  if (/^[0-9+\-*/().\s×÷−%]+$/.test(casualMath) && /[0-9]/.test(casualMath) && /[+\-*/×÷−%]/.test(casualMath)) {
    return `calculate ${casualMath}`;
  }

  return normalized;
}

export type AssistantIntent =
  | { kind: 'greeting' }
  | { kind: 'help' }
  | { kind: 'time' }
  | { kind: 'date' }
  | { kind: 'reminder'; title: string; dueDate?: string; dueTime?: string }
  | { kind: 'command'; command: string }
  | { kind: 'search'; query: string };

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseReminder(text: string): AssistantIntent | null {
  const match = text.match(
    /^(?:remind me to|remind me|set (?:me )?(?:a )?reminder to|create (?:a )?reminder to|add (?:a )?reminder to)\s+(.+)$/i,
  );
  if (!match) return null;

  let title = normalizeSpokenNumbers(match[1]).trim();
  let dueDate: string | undefined;
  let dueTime: string | undefined;
  const now = new Date();

  const durationMatch = title.match(
    /\s+(?:in|after)\s+(\d+(?:\.\d+)?)\s+(seconds?|secs?|minutes?|mins?|hours?|hrs?|days?)$/i,
  );
  if (durationMatch) {
    title = title.slice(0, durationMatch.index).trim();
    const amount = Number(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();
    const multiplier = unit.startsWith('sec') ? 1000
      : unit.startsWith('min') ? 60_000
        : unit.startsWith('hour') || unit.startsWith('hr') ? 3_600_000
          : 86_400_000;
    const due = new Date(now.getTime() + amount * multiplier);
    dueDate = localDateKey(due);
    dueTime = `${String(due.getHours()).padStart(2, '0')}:${String(due.getMinutes()).padStart(2, '0')}`;
  } else {
    const relativeMatch = title.match(
      /\s+(today|tomorrow)(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?$/i,
    );
    if (relativeMatch) {
      title = title.slice(0, relativeMatch.index).trim();
      const due = new Date(now);
      if (relativeMatch[1].toLowerCase() === 'tomorrow') due.setDate(due.getDate() + 1);
      dueDate = localDateKey(due);

      if (relativeMatch[2]) {
        let hour = Number(relativeMatch[2]);
        const minute = Number(relativeMatch[3] ?? 0);
        const meridiem = relativeMatch[4]?.toLowerCase();
        if (meridiem === 'pm' && hour < 12) hour += 12;
        if (meridiem === 'am' && hour === 12) hour = 0;
        if (hour <= 23 && minute <= 59) {
          dueTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        }
      }
    }
  }

  if (!title) return null;
  return { kind: 'reminder', title, dueDate, dueTime };
}

export function parseAssistantInput(rawText: string): AssistantIntent {
  const text = rawText.trim().replace(/[?!.,]+$/g, '').trim();
  const normalized = text.toLowerCase();

  if (/^(hi|hello|hey)( nexa)?$/.test(normalized)) return { kind: 'greeting' };
  if (/^(help|what can you do|what can you do nexa)$/.test(normalized)) return { kind: 'help' };
  if (/^(what time is it|tell me the time|current time|what's the time)$/.test(normalized)) return { kind: 'time' };
  if (/^(what(?:'s| is) the date|what date is it|today's date|what day is it)$/.test(normalized)) return { kind: 'date' };

  const reminder = parseReminder(text);
  if (reminder) return reminder;

  const command = normalizeCommand(text);
  const parsedSearch = command.match(/^(?:search|web search|look up)\s+(?:for\s+)?(.+)$/i);
  if (parsedSearch) return { kind: 'search', query: parsedSearch[1].trim() };

  const commandIntent = /^(?:open|launch|go to|show|timer|set timer|calculate|calculator|calc|new note|create note)\b/i.test(command);
  if (commandIntent || /^[0-9].*[+*/%-]/.test(command)) {
    return { kind: 'command', command };
  }

  return { kind: 'search', query: text };
}
