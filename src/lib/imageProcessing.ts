// Client-side image upload pipeline (browser, canvas-based). Runs entirely on
// the user's device — no server round-trip needed — and produces a normalized
// asset that matches our IMAGE_SPECS:
//
//   • Auto-crop      → center-crops to the target aspect ratio
//   • Auto-resize    → scales to the canonical export size
//   • Auto-WebP      → re-encodes to WebP (PNG kept only when transparency wins)
//   • Auto-compress  → steps quality down until under the spec's max size
//
// In production you would hand the resulting Blob to Supabase Storage / a CDN;
// here we also expose a data URL so the demo can persist it in localStorage.

import { IMAGE_SPECS, type ImageKind } from "./images";

export interface ProcessedImage {
  /** data URL (persisted in the demo; upload the blob in production) */
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image_decode_failed"));
    };
    img.src = url;
  });
}

/** Center-crop source rect for a target aspect ratio (cover, no distortion). */
function coverCrop(sw: number, sh: number, ratio: number) {
  const srcRatio = sw / sh;
  if (srcRatio > ratio) {
    // too wide → crop sides
    const w = Math.round(sh * ratio);
    return { sx: Math.round((sw - w) / 2), sy: 0, sWidth: w, sHeight: sh };
  }
  // too tall → crop top/bottom
  const h = Math.round(sw / ratio);
  return { sx: 0, sy: Math.round((sh - h) / 2), sWidth: sw, sHeight: h };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("encode_failed"))),
      type,
      quality,
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("read_failed"));
    r.readAsDataURL(blob);
  });
}

/**
 * Processes a user-selected file into a spec-compliant asset. Throws on
 * non-images or decode failures so callers can show an error.
 */
export async function processImage(
  file: File,
  kind: ImageKind,
): Promise<ProcessedImage> {
  if (!file.type.startsWith("image/")) throw new Error("not_an_image");
  const spec = IMAGE_SPECS[kind];

  const img = await loadImage(file);
  const { sx, sy, sWidth, sHeight } = coverCrop(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    spec.ratio,
  );

  const canvas = document.createElement("canvas");
  canvas.width = spec.width;
  canvas.height = spec.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no_canvas_context");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  // Crop + resize in one draw call.
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, spec.width, spec.height);

  // Re-encode to the target format, compressing down until under the cap.
  const type = spec.format;
  let quality = spec.quality / 100;
  let blob = await canvasToBlob(canvas, type, quality);
  const cap = spec.maxBytes;
  while (cap > 0 && blob.size > cap && quality > 0.4) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, type, quality);
  }

  const dataUrl = await blobToDataUrl(blob);
  return {
    dataUrl,
    blob,
    width: spec.width,
    height: spec.height,
    bytes: blob.size,
    format: blob.type || type,
  };
}
