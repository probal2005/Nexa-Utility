import {
  AlarmClock,
  Bell,
  BookOpen,
  Calculator,
  CalendarDays,
  Camera,
  CheckSquare,
  ClipboardList,
  Clock3,
  Compass,
  FileScan,
  FileText,
  Files,
  FolderKanban,
  GraduationCap,
  Image,
  Map,
  Mic,
  Music,
  NotebookPen,
  ScanLine,
  ScanText,
  Timer,
  TimerReset,
  CloudSun,
  Ruler,
  QrCode,
  Barcode,
  Search,
  Terminal,
  AudioLines,
} from "lucide-react";

import type { Tool } from "@/types/tool";

export const TOOLS: Tool[] = [
  /* ---------------------------------------------------------------------- */
  /* CORE                                                                   */
  /* ---------------------------------------------------------------------- */

  {
    id: "clock",
    name: "Clock",
    description: "Live clock, stopwatch and timer",
    icon: Clock3,
    href: "/clock",
    category: "core",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "clock",
      "time",
      "world clock",
      "stopwatch",
      "timer",
      "countdown",
    ],
  },

  {
    id: "calculator",
    name: "Calculator",
    description: "Fast everyday calculator",
    icon: Calculator,
    href: "/calculator",
    category: "core",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "calculator",
      "math",
      "arithmetic",
      "calculate",
    ],
  },

  {
    id: "notifications",
    name: "Notifications",
    description: "View reminders, alerts and Nexa activity",
    icon: Bell,
    href: "/notifications",
    category: "core",
    available: true,
    featured: false,
    mobile: true,
    keywords: [
      "notifications",
      "notification",
      "alerts",
      "activity",
      "bell",
    ],
  },

  {
    id: "calendar",
    name: "Calendar",
    description: "Manage events and dates",
    icon: CalendarDays,
    href: "/calendar",
    category: "core",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "calendar",
      "events",
      "date",
      "schedule",
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* PRODUCTIVITY                                                           */
  /* ---------------------------------------------------------------------- */

  {
    id: "notes",
    name: "Notes",
    description: "Create and manage local notes",
    icon: NotebookPen,
    href: "/notes",
    category: "productivity",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "notes",
      "note",
      "write",
      "memo",
      "journal",
    ],
  },

  {
    id: "reminders",
    name: "Reminders",
    description: "Track things you need to remember",
    icon: AlarmClock,
    href: "/reminders",
    category: "productivity",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "reminders",
      "reminder",
      "alerts",
      "due",
    ],
  },

  {
    id: "tasks",
    name: "Tasks",
    description: "Manage tasks and priorities",
    icon: CheckSquare,
    href: "/tasks",
    category: "productivity",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "tasks",
      "todo",
      "to-do",
      "checklist",
      "productivity",
    ],
  },

  {
    id: "pomodoro",
    name: "Pomodoro",
    description: "Focus sessions and productivity timer",
    icon: TimerReset,
    href: "/pomodoro",
    category: "productivity",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "pomodoro",
      "focus",
      "study timer",
      "deep work",
    ],
  },

  {
    id: "academic-planner",
    name: "Academic Planner",
    description: "Plan assignments, projects and study goals",
    icon: ClipboardList,
    href: "/study/planner",
    category: "study",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "academic planner",
      "planner",
      "assignment",
      "project",
      "deadline",
      "study goal",
    ],
  },

  {
    id: "study-analytics",
    name: "Study Analytics",
    description: "Analyze study time, exams and academic progress",
    icon: FolderKanban,
    href: "/study/analytics",
    category: "study",
    available: true,
    featured: false,
    mobile: false,
    keywords: [
      "study analytics",
      "analytics",
      "study statistics",
      "study progress",
      "academic statistics",
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* STUDY                                                                  */
  /* ---------------------------------------------------------------------- */

  {
    id: "study",
    name: "Study Tools",
    description: "Academic calculators and study utilities",
    icon: GraduationCap,
    href: "/study",
    category: "study",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "study",
      "student",
      "academic",
      "education",
      "gpa",
      "cgpa",
      "grades",
      "exam",
    ],
  },

  {
    id: "gpa",
    name: "GPA Calculator",
    description: "Calculate semester GPA",
    icon: GraduationCap,
    href: "/study/gpa",
    category: "study",
    available: true,
    featured: false,
    mobile: false,
    keywords: [
      "gpa",
      "grade point",
      "semester gpa",
      "college gpa",
    ],
  },

  {
    id: "grade-calculator",
    name: "Grade Calculator",
    description: "Calculate percentage and grade",
    icon: Calculator,
    href: "/study/grades",
    category: "study",
    available: true,
    featured: false,
    mobile: false,
    keywords: [
      "grade",
      "percentage",
      "marks",
      "grade calculator",
    ],
  },

  {
    id: "exam-countdown",
    name: "Exam Countdown",
    description: "Track upcoming exams",
    icon: Timer,
    href: "/study/exams",
    category: "study",
    available: true,
    featured: false,
    mobile: false,
    keywords: [
      "exam",
      "exams",
      "countdown",
      "exam countdown",
    ],
  },

  {
    id: "study-sessions",
    name: "Study Sessions",
    description: "Track focused study sessions",
    icon: BookOpen,
    href: "/study/sessions",
    category: "study",
    available: true,
    featured: false,
    mobile: false,
    keywords: [
      "study sessions",
      "study timer",
      "focus sessions",
      "study time",
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* UTILITY                                                                */
  /* ---------------------------------------------------------------------- */

  {
    id: "converter",
    name: "Unit Converter",
    description: "Convert length, mass, temperature and more",
    icon: Ruler,
    href: "/converter",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "converter",
      "unit converter",
      "length",
      "mass",
      "temperature",
      "area",
      "volume",
      "speed",
      "data",
      "energy",
    ],
  },

  {
    id: "compass",
    name: "Compass",
    description: "Digital compass using device sensors",
    icon: Compass,
    href: "/compass",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "compass",
      "direction",
      "north",
      "heading",
    ],
  },

  {
    id: "measure",
    name: "Measure",
    description: "Measure distances and angles",
    icon: Ruler,
    href: "/measure",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "measure",
      "measurement",
      "distance",
      "angle",
      "ruler",
    ],
  },

  {
    id: "maps",
    name: "Maps",
    description: "Explore maps and your current location",
    icon: Map,
    href: "/maps",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "maps",
      "map",
      "location",
      "navigation",
      "places",
    ],
  },

  {
    id: "assistant",
    name: "Voice Assistant",
    description: "Speak or type to control Nexa tools and search the web",
    icon: AudioLines,
    href: "/assistant",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "assistant",
      "voice assistant",
      "voice control",
      "speech",
      "siri",
      "jarvis",
      "maya",
    ],
  },

  {
    id: "terminal",
    name: "Terminal",
    description: "Run quick Nexa tasks from a command line",
    icon: Terminal,
    href: "/terminal",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "terminal",
      "cmd",
      "command prompt",
      "shell",
      "ubuntu",
      "linux",
      "commands",
    ],
  },

  {
    id: "search",
    name: "Search",
    description: "Search the web by text or voice and run quick commands",
    icon: Search,
    href: "/search",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "search",
      "web search",
      "voice search",
      "google",
      "internet",
      "commands",
    ],
  },

  {
    id: "weather",
    name: "Weather",
    description: "Current weather and forecast",
    icon: CloudSun,
    href: "/weather",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "weather",
      "forecast",
      "temperature",
      "rain",
      "wind",
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* CAMERA / SCANNER                                                       */
  /* ---------------------------------------------------------------------- */

  {
    id: "camera",
    name: "Camera",
    description: "Capture photos with your device camera",
    icon: Camera,
    href: "/camera",
    category: "media",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "camera",
      "photo",
      "capture",
      "picture",
    ],
  },

  {
    id: "scanner",
    name: "Scanner",
    description: "QR, barcode, document and OCR scanning",
    icon: ScanLine,
    href: "/scanner",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "scanner",
      "scan",
      "scanning",
      "qr",
      "barcode",
      "document",
      "ocr",
    ],
  },

  {
    id: "qr-scanner",
    name: "QR Scanner",
    description: "Scan QR codes with your camera",
    icon: QrCode,
    href: "/camera/qr",
    category: "utility",
    available: true,
    featured: false,
    mobile: false,
    keywords: [
      "qr",
      "qr scanner",
      "qr code",
      "scan qr",
    ],
  },

  {
    id: "barcode-scanner",
    name: "Barcode Scanner",
    description: "Scan 1D product and inventory barcodes",
    icon: Barcode,
    href: "/camera/barcode",
    category: "utility",
    available: true,
    featured: false,
    mobile: false,
    keywords: [
      "barcode",
      "barcode scanner",
      "product barcode",
      "inventory",
    ],
  },

  {
    id: "document-scanner",
    name: "Document Scanner",
    description: "Capture physical documents",
    icon: FileScan,
    href: "/camera/document",
    category: "utility",
    available: true,
    featured: false,
    mobile: false,
    keywords: [
      "document scanner",
      "document scan",
      "documents",
      "paper",
      "scan document",
    ],
  },

  {
    id: "ocr-scanner",
    name: "OCR Scanner",
    description: "Extract editable text from images",
    icon: ScanText,
    href: "/scanner/ocr",
    category: "utility",
    available: true,
    featured: true,
    mobile: false,
    keywords: [
      "ocr",
      "ocr scanner",
      "text recognition",
      "extract text",
      "image to text",
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* MEDIA                                                                  */
  /* ---------------------------------------------------------------------- */

  {
    id: "photos",
    name: "Photos",
    description: "Browse locally captured photos",
    icon: Image,
    href: "/photos",
    category: "media",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "photos",
      "pictures",
      "gallery",
      "images",
    ],
  },

  {
    id: "music",
    name: "Music",
    description: "Play local audio files",
    icon: Music,
    href: "/music",
    category: "media",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "music",
      "audio",
      "songs",
      "player",
      "playlist",
    ],
  },

  {
    id: "recorder",
    name: "Voice Recorder",
    description: "Record and manage voice recordings",
    icon: Mic,
    href: "/recorder",
    category: "media",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "voice recorder",
      "recorder",
      "record",
      "audio recorder",
      "voice",
      "microphone",
    ],
  },

  {
    id: "files",
    name: "Files",
    description: "Manage local files and documents",
    icon: Files,
    href: "/files",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "files",
      "file manager",
      "documents",
      "uploads",
      "storage",
    ],
  },

  {
    id: "pdf",
    name: "PDF Tools",
    description: "Merge, split, rotate and create PDFs",
    icon: FileText,
    href: "/pdf",
    category: "utility",
    available: true,
    featured: true,
    mobile: true,
    keywords: [
      "pdf",
      "pdf tools",
      "merge pdf",
      "split pdf",
      "rotate pdf",
      "images to pdf",
    ],
  },

  /* ---------------------------------------------------------------------- */
  /* FUTURE / ADVANCED                                                      */
  /* ---------------------------------------------------------------------- */

];

export const AVAILABLE_TOOLS = TOOLS.filter(
  (tool) => tool.available,
);

export const FEATURED_TOOLS = AVAILABLE_TOOLS.filter(
  (tool) => tool.featured,
);

export const MOBILE_TOOLS = AVAILABLE_TOOLS.filter(
  (tool) => tool.mobile,
);

export const TOOL_CATEGORIES = [
  {
    id: "core",
    name: "Core",
  },
  {
    id: "productivity",
    name: "Productivity",
  },
  {
    id: "utility",
    name: "Utilities",
  },
  {
    id: "study",
    name: "Study",
  },
  {
    id: "media",
    name: "Media",
  },
  {
    id: "advanced",
    name: "Advanced",
  },
] as const;

export function searchTools(query: string): Tool[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return AVAILABLE_TOOLS;
  }

  return AVAILABLE_TOOLS.filter((tool) => {
    const searchableText = [
      tool.name,
      tool.description,
      tool.category,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalized);
  });
}

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolByHref(
  href: string,
): Tool | undefined {
  return TOOLS.find((tool) => tool.href === href);
}
