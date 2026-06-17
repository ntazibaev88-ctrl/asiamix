// Resolves a real product photo from Open Food Facts by barcode, caching the
// resolved URL in localStorage. Runs in the browser (the user's device fetches
// the image directly), so it works on the deployed site. Falls back to null
// when nothing is found — callers then render a styled placeholder.

const mem = new Map<string, string | null>();

function key(barcode: string) {
  return `nomi.img.${barcode}`;
}

export async function resolveProductImage(
  barcode: string,
): Promise<string | null> {
  if (mem.has(barcode)) return mem.get(barcode) ?? null;

  try {
    const cached = localStorage.getItem(key(barcode));
    if (cached !== null) {
      const val = cached || null;
      mem.set(barcode, val);
      return val;
    }
  } catch {
    /* storage unavailable */
  }

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=image_front_small_url,image_front_url`,
    );
    const json = await res.json();
    const url: string =
      json?.product?.image_front_small_url ??
      json?.product?.image_front_url ??
      "";
    try {
      localStorage.setItem(key(barcode), url);
    } catch {
      /* ignore */
    }
    mem.set(barcode, url || null);
    return url || null;
  } catch {
    mem.set(barcode, null);
    return null;
  }
}
