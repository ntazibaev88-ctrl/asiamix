"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { processImage } from "@/lib/imageProcessing";
import { IMAGE_SPECS, ASPECT_CLASS, type ImageKind } from "@/lib/images";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * Upload control that runs the full client pipeline on pick/drop
 * (auto-crop → resize → WebP → compress) and hands back a normalized data URL.
 * The preview uses the kind's aspect ratio so the editor matches the storefront.
 */
export function ImageUploader({
  value,
  onChange,
  kind,
  className,
  label,
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  kind: ImageKind;
  className?: string;
  label?: string;
}) {
  const { t } = useI18n();
  const spec = IMAGE_SPECS[kind];
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const handle = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setErr(false);
    try {
      const out = await processImage(file, kind);
      onChange(out.dataUrl);
      setInfo(`${spec.width}×${spec.height} · ${Math.round(out.bytes / 1024)}KB · WebP`);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handle(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative grid w-full cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed bg-surface-2 text-faint transition-colors hover:border-brand",
          ASPECT_CLASS[kind],
          err ? "border-danger" : "border-border-strong",
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
                setInfo(null);
              }}
              className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60"
              aria-label="remove"
            >
              <X size={14} />
            </button>
          </>
        ) : busy ? (
          <Loader2 size={22} className="animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-1 p-3 text-center">
            <ImagePlus size={22} />
            <span className="text-[11px] font-medium">
              {label ?? t("img.upload")}
            </span>
            <span className="text-[10px] text-faint">
              {spec.width}×{spec.height}
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </div>
      {info && <span className="text-[10px] text-success">✓ {info}</span>}
      {err && <span className="text-[10px] text-danger">{t("img.error")}</span>}
    </div>
  );
}
