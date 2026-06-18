"use client";

import { useEffect, useState } from "react";
import { resolveProductImage } from "@/lib/productImage";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/mock";

/**
 * Product image (1:1) rendered through the platform's responsive image system,
 * so it stays sharp on every device and never shifts layout. A static `image`
 * is used directly; otherwise the photo is resolved by barcode via Open Food
 * Facts (browser-side, cached). Falls back to the product emoji.
 */
export function ProductImage({
  product,
  className,
  emojiClassName = "text-6xl",
  priority = false,
}: {
  product: Product;
  className?: string;
  emojiClassName?: string;
  priority?: boolean;
}) {
  const [src, setSrc] = useState<string | null>(product.image ?? null);

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

  return (
    <ResponsiveImage
      src={src}
      kind="product"
      alt={product.name?.ru ?? ""}
      fit="contain"
      priority={priority}
      className={cn("bg-white", className)}
      fallback={<span className={emojiClassName}>{product.emoji}</span>}
    />
  );
}
