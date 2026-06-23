"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export function BookReaderClient({
  pdfUrl,
  title,
}: {
  pdfUrl: string;
  title: string;
}) {
  const [zoom, setZoom] = useState(100);

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 150));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 60));
  const reset = () => setZoom(100);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={zoomOut}
          disabled={zoom <= 60}
          className="p-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors disabled:opacity-40"
          title="Кішірейту"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
        <button
          onClick={zoomIn}
          disabled={zoom >= 150}
          className="p-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors disabled:opacity-40"
          title="Үлкейту"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors"
          title="Қалпына келтіру"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden border border-[var(--border)]" style={{ height: "75vh" }}>
        <iframe
          src={`${pdfUrl}#toolbar=1&view=FitH&zoom=${zoom}`}
          title={title}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
