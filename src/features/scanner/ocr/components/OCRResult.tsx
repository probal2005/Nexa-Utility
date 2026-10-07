"use client";

import {
  BellPlus,
  Check,
  Copy,
  FileText,
  NotebookPen,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

import {
  createNoteFromOCRResult,
} from "@/features/integrations/ocr-notes/ocrNote";

import {
  createReminderFromOCRResult,
} from "@/features/integrations/ocr-reminders/ocrReminder";

import type {
  OCRResult as OCRResultType,
} from "../types";

type OCRResultProps = {
  result: OCRResultType;
  onReset: () => void;
};

export default function OCRResult({
  result,
  onReset,
}: OCRResultProps) {
  const [copied, setCopied] =
    useState(false);

  const [noteStatus, setNoteStatus] =
    useState<
      "idle" | "created" | "exists"
    >("idle");

  const [
    reminderStatus,
    setReminderStatus,
  ] = useState<
    "idle" | "created" | "exists"
  >("idle");

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(
        result.text,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  const saveToNotes = () => {
    if (!result.text.trim()) {
      return;
    }

    const response =
      createNoteFromOCRResult(
        result,
      );

    if (response.created) {
      setNoteStatus("created");
    } else {
      setNoteStatus("exists");
    }
  };

  const createReminder = () => {
    if (!result.text.trim()) {
      return;
    }

    const response =
      createReminderFromOCRResult(
        result,
      );

    if (response.created) {
      setReminderStatus("created");
    } else if (
      response.reason ===
      "already-exists"
    ) {
      setReminderStatus("exists");
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Extracted text
            </h2>

            <p className="text-xs text-white/40">
              Confidence:{" "}
              {Math.round(
                result.confidence,
              )}
              %
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyText}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white transition hover:bg-white/10"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}

            {copied
              ? "Copied"
              : "Copy"}
          </button>

          <button
            type="button"
            onClick={saveToNotes}
            disabled={
              !result.text.trim() ||
              noteStatus === "created"
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {noteStatus === "created" ? (
              <Check className="h-4 w-4" />
            ) : (
              <NotebookPen className="h-4 w-4" />
            )}

            {noteStatus === "created"
              ? "Saved to Notes"
              : noteStatus === "exists"
                ? "Note already exists"
                : "Save to Notes"}
          </button>

          <button
            type="button"
            onClick={createReminder}
            disabled={
              !result.text.trim() ||
              reminderStatus === "created"
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {reminderStatus === "created" ? (
              <Check className="h-4 w-4" />
            ) : (
              <BellPlus className="h-4 w-4" />
            )}

            {reminderStatus === "created"
              ? "Reminder created"
              : reminderStatus === "exists"
                ? "Reminder already exists"
                : "Create Reminder"}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            New scan
          </button>
        </div>
      </div>

      {noteStatus === "created" && (
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/70">
          ✓ OCR text has been saved as a new
          note.
        </div>
      )}

      {noteStatus === "exists" && (
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/70">
          This OCR result has already been
          saved to Notes.
        </div>
      )}

      {reminderStatus === "created" && (
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/70">
          ✓ A reminder has been created from
          this OCR result.
        </div>
      )}

      {reminderStatus === "exists" && (
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/70">
          This OCR result has already been
          added as a reminder.
        </div>
      )}

      <div className="p-5">
        <textarea
          value={result.text}
          readOnly
          className="min-h-72 w-full resize-y rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white outline-none"
        />
      </div>
    </section>
  );
}
