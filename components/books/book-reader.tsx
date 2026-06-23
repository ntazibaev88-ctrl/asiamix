"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export function BookReaderClient({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
        <span className="text-sm font-medium truncate">{title}</span>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            onClick={() => setZoom((z) => Math.max(60, z - 10))}
            className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs min-w-[3rem] text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden border border-[var(--border)] bg-white"
        style={{ height: "75vh" }}
      >
        <iframe
          src={`${pdfUrl}#toolbar=1&view=FitH&zoom=${zoom}`}
          title={title}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
