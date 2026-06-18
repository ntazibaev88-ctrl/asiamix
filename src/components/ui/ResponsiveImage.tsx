"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { IMAGE_SPECS, ASPECT_CLASS, isLocalSrc, type ImageKind } from "@/lib/images";
import { cn } from "@/lib/cn";

/**
 * Platform-wide responsive image. Wraps next/image so every image gets:
 *   • the correct aspect ratio per kind (no layout shift / CLS)
 *   • a responsive `sizes` hint → the right resolution on every device
 *   • automatic AVIF/WebP + lazy loading (via next/image + next.config)
 *   • a graceful fallback (emoji / initial / icon) when there is no photo
 *
 * Uploaded data/blob URLs are served as-is (`unoptimized`) since the optimizer
 * only handles real/remote URLs; their bytes are already minimized at upload.
 */
export function ResponsiveImage({
  src,
  kind,
  alt,
  fallback,
  fit = "cover",
  rounded,
  priority = false,
  className,
  sizes,
}: {
  src?: string | null;
  kind: ImageKind;
  alt: string;
  /** shown when there is no image or it fails to load */
  fallback?: ReactNode;
  fit?: "cover" | "contain";
  rounded?: string;
  priority?: boolean;
  /** wrapper classes — control the rendered box size here (e.g. w-full, h-16) */
  className?: string;
  /** override the spec's default responsive sizes if needed */
  sizes?: string;
}) {
  const spec = IMAGE_SPECS[kind];
  const [failed, setFailed] = useState(false);
  const show = src && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-2",
        ASPECT_CLASS[kind],
        rounded,
        className,
      )}
    >
      {show ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? spec.sizes}
          quality={spec.quality}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          unoptimized={isLocalSrc(src)}
          onError={() => setFailed(true)}
          className={fit === "contain" ? "object-contain p-[6%]" : "object-cover"}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">{fallback}</div>
      )}
    </div>
  );
}
