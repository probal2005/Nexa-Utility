"use client";

import { ImagePlus } from "lucide-react";
import { useRef } from "react";

type OCRImageInputProps = {
  onSelect: (file: File) => void;
  disabled?: boolean;
};

export default function OCRImageInput({
  onSelect,
  disabled = false,
}: OCRImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onSelect(file);
          }

          event.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ImagePlus className="h-4 w-4" />
        Choose image
      </button>
    </>
  );
}
