// Central image standards for the whole platform. Every image type has a fixed
// aspect ratio, a canonical export size, and a responsive `sizes` hint so
// next/image serves the right resolution on every device (iOS / Android /
// tablet / laptop / desktop). Keep this file as the single source of truth — UI
// components and the upload pipeline both read from it.

export type ImageKind =
  | "product" // 1:1  · 1000×1000 · WebP · ≤300KB
  | "logo" //    1:1  · 512×512   · PNG/WebP
  | "category" // 1:1  · 800×800
  | "banner" //  16:9 · 1920×1080
  | "promo"; //  3:1  · 1200×400

export interface ImageSpec {
  kind: ImageKind;
  /** width / height */
  ratio: number;
  /** canonical export width, px */
  width: number;
  /** canonical export height, px */
  height: number;
  /** target output format */
  format: "image/webp" | "image/png";
  /** max output size after compression, bytes (0 = no hard cap) */
  maxBytes: number;
  /** responsive sizes hint for next/image */
  sizes: string;
  /** default render quality (must be in next.config images.qualities) */
  quality: number;
}

export const IMAGE_SPECS: Record<ImageKind, ImageSpec> = {
  product: {
    kind: "product",
    ratio: 1,
    width: 1000,
    height: 1000,
    format: "image/webp",
    maxBytes: 300 * 1024,
    // Grid of cards on phones, fewer-but-larger on tablet/desktop.
    sizes: "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px",
    quality: 80,
  },
  logo: {
    kind: "logo",
    ratio: 1,
    width: 512,
    height: 512,
    format: "image/webp",
    maxBytes: 150 * 1024,
    sizes: "(max-width: 640px) 72px, 96px",
    quality: 90,
  },
  category: {
    kind: "category",
    ratio: 1,
    width: 800,
    height: 800,
    format: "image/webp",
    maxBytes: 200 * 1024,
    sizes: "(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 180px",
    quality: 80,
  },
  banner: {
    kind: "banner",
    ratio: 16 / 9,
    width: 1920,
    height: 1080,
    format: "image/webp",
    maxBytes: 400 * 1024,
    // Full-bleed hero; on large screens it is centred in the content column.
    sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1200px",
    quality: 80,
  },
  promo: {
    kind: "promo",
    ratio: 1200 / 400,
    width: 1200,
    height: 400,
    format: "image/webp",
    maxBytes: 300 * 1024,
    sizes: "(max-width: 768px) 92vw, 720px",
    quality: 80,
  },
};

/** Tailwind aspect-ratio utility per kind (keeps layout stable, no CLS). */
export const ASPECT_CLASS: Record<ImageKind, string> = {
  product: "aspect-square",
  logo: "aspect-square",
  category: "aspect-square",
  banner: "aspect-video",
  promo: "aspect-[3/1]",
};

/** A src is "local" (no remote optimization possible) when it's a data/blob URL. */
export function isLocalSrc(src: string): boolean {
  return src.startsWith("data:") || src.startsWith("blob:");
}
