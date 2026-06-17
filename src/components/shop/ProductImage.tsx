"use client";

import { useEffect, useState } from "react";
import { resolveProductImage } from "@/lib/productImage";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/mock";

/**
 * Product image with a graceful emoji placeholder. Real photos are loaded on a
 * white background with object-contain (no stretching/cropping). When a static
 * `image` is set it is used directly; otherwise we look it up by barcode via
 * Open Food Facts (browser-side, cached).
 */
export function ProductImage({
  product,
  className,
  emojiClassName = "text-6xl",
}: {
  product: Product;
  className?: string;
  emojiClassName?: string;
}) {
  const [src, setSrc] = useState<string | null>(product.image ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (product.image || !product.barcode) return;
    let active = true;
    resolveProductImage(product.barcode).then((url) => {
      if (active && url) setSrc(url);
    });
    return () => {
      active = false;
    };
  }, [product.image, product.barcode]);

  const showImage = src && !failed;

  return (
    <div className={cn("relative grid place-items-center bg-white", className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-3"
        />
      ) : (
        <span className={emojiClassName}>{product.emoji}</span>
      )}
    </div>
  );
}
