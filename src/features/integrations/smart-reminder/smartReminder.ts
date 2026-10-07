export type SmartReminderPriority =
  | "low"
  | "medium"
  | "high";

export type SmartReminderDetails = {
  title: string;
  priority: SmartReminderPriority;
};

const HIGH_PRIORITY_PATTERNS = [
  /\burgent\b/i,
  /\basap\b/i,
  /\bimmediately\b/i,
  /\bcritical\b/i,
  /\bhigh\s*priority\b/i,
  /\bpriority\s*[:\-]?\s*high\b/i,
  /\bimportant\b/i,
  /\bvery\s+important\b/i,
];

const LOW_PRIORITY_PATTERNS = [
  /\blow\s*priority\b/i,
  /\bpriority\s*[:\-]?\s*low\b/i,
  /\bwhenever\b/i,
  /\bno\s+rush\b/i,
  /\bnot\s+urgent\b/i,
];

const MEDIUM_PRIORITY_PATTERNS = [
  /\bmedium\s*priority\b/i,
  /\bpriority\s*[:\-]?\s*medium\b/i,
  /\bnormal\s*priority\b/i,
];

const GENERIC_PREFIX_PATTERNS = [
  /^\s*urgent\s*[:\-]\s*/i,
  /^\s*important\s*[:\-]\s*/i,
  /^\s*asap\s*[:\-]\s*/i,
  /^\s*reminder\s*[:\-]\s*/i,
  /^\s*todo\s*[:\-]\s*/i,
  /^\s*to[\s-]?do\s*[:\-]\s*/i,
  /^\s*task\s*[:\-]\s*/i,
  /^\s*note\s*[:\-]\s*/i,
  /^\s*priority\s*[:\-]?\s*(?:high|medium|low)\s*[:\-]?\s*/i,
];

const INLINE_PRIORITY_PATTERNS = [
  /\s*[\(\[]\s*(?:urgent|asap|critical|important|high\s*priority)\s*[\)\]]\s*/gi,
  /\s*[\(\[]\s*(?:low\s*priority|medium\s*priority|normal\s*priority)\s*[\)\]]\s*/gi,
];

function normalizeWhitespace(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .trim();
}

function cleanTitle(value: string): string {
  let title = normalizeWhitespace(value);

  for (const pattern of GENERIC_PREFIX_PATTERNS) {
    title = title.replace(pattern, "");
  }

  for (const pattern of INLINE_PRIORITY_PATTERNS) {
    title = title.replace(pattern, " ");
  }

  title = title
    .replace(
      /\s*[-:|]\s*(?:urgent|asap|critical|important|high priority|medium priority|low priority)\s*$/i,
      "",
    )
    .trim();

  title = normalizeWhitespace(title);

  if (!title) {
    return "OCR Reminder";
  }

  return title.slice(0, 100);
}

function getFirstUsefulLine(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

  if (lines.length === 0) {
    return "OCR Reminder";
  }

  const ignoredOnlyLinePatterns = [
    /^urgent$/i,
    /^important$/i,
    /^asap$/i,
    /^critical$/i,
    /^high\s*priority$/i,
    /^medium\s*priority$/i,
    /^low\s*priority$/i,
    /^priority\s*[:\-]?\s*(high|medium|low)$/i,
    /^reminder$/i,
    /^todo$/i,
    /^to[\s-]?do$/i,
    /^task$/i,
  ];

  const usefulLine =
    lines.find(
      (line) =>
        !ignoredOnlyLinePatterns.some(
          (pattern) => pattern.test(line),
        ),
    ) ?? lines[0];

  return usefulLine;
}

export function detectReminderPriority(
  text: string,
): SmartReminderPriority {
  const normalized = text.trim();

  if (
    HIGH_PRIORITY_PATTERNS.some((pattern) =>
      pattern.test(normalized),
    )
  ) {
    return "high";
  }

  if (
    LOW_PRIORITY_PATTERNS.some((pattern) =>
      pattern.test(normalized),
    )
  ) {
    return "low";
  }

  if (
    MEDIUM_PRIORITY_PATTERNS.some((pattern) =>
      pattern.test(normalized),
    )
  ) {
    return "medium";
  }

  return "medium";
}

export function extractReminderTitle(
  text: string,
): string {
  const firstLine = getFirstUsefulLine(text);
  return cleanTitle(firstLine);
}

export function extractSmartReminderDetails(
  text: string,
): SmartReminderDetails {
  return {
    title: extractReminderTitle(text),
    priority: detectReminderPriority(text),
  };
}
