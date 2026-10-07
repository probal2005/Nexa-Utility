'use client';

import {
  FileImage,
  FilePlus2,
  Files,
  RotateCw,
  Scissors,
} from 'lucide-react';

import type {
  PDFTool,
} from '../types';

type PDFToolSelectorProps = {
  tool: PDFTool;
  onChange: (
    tool: PDFTool,
  ) => void;
};

const tools: {
  id: PDFTool;
  label: string;
  description: string;
  icon: typeof Files;
}[] = [
  {
    id: 'merge',
    label: 'Merge',
    description:
      'Combine multiple PDFs',
    icon: Files,
  },
  {
    id: 'split',
    label: 'Split',
    description:
      'Extract selected pages',
    icon: Scissors,
  },
  {
    id: 'rotate',
    label: 'Rotate',
    description:
      'Rotate PDF pages',
    icon: RotateCw,
  },
  {
    id: 'images-to-pdf',
    label: 'Images to PDF',
    description:
      'Create PDF from images',
    icon: FileImage,
  },
  {
    id: 'pdf-to-images',
    label: 'PDF to Images',
    description:
      'Export PDF pages',
    icon: FilePlus2,
  },
];

export function PDFToolSelector({
  tool,
  onChange,
}: PDFToolSelectorProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {tools.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              onChange(item.id)
            }
            className={`rounded-2xl border p-4 text-left transition ${
              tool === item.id
                ? 'border-white/20 bg-white/10'
                : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
            }`}
          >
            <Icon
              size={19}
              className="text-white"
            />

            <div className="mt-3 text-sm font-medium text-white">
              {item.label}
            </div>

            <div className="mt-1 text-xs leading-5 text-zinc-600">
              {item.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
