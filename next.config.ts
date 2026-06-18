import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  // Next.js needs inline bootstrap/runtime; framer-motion injects inline styles.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.open-meteo.com https://world.openfoodfacts.org https://images.openfoodfacts.org",
  "frame-src https://www.openstreetmap.org",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Auto-convert to modern formats: AVIF first (smallest), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Device-width breakpoints used to build srcset for responsive `sizes`
    // images — covers every target platform (mobile → 4K desktop, incl. 2×):
    //   mobile 320/375/390/414 · tablet 768/820/1024 · laptop 1280/1366/1440
    //   desktop 1920/2560 (+ retina widths).
    deviceSizes: [
      320, 375, 390, 414, 640, 750, 768, 820, 828, 1024, 1080, 1200, 1280,
      1366, 1440, 1920, 2048, 2560, 3840,
    ],
    // Widths for images smaller than the viewport (thumbnails, logos, tiles).
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 384],
    // Quality allowlist (Next.js 16 requires this when using custom qualities).
    qualities: [50, 60, 70, 75, 80, 90, 100],
    // CDN-ready: cache optimized images for a year at the edge.
    minimumCacheTTL: 31_536_000,
    // Allow remote sources we resolve photos from (Open Food Facts) and the
    // production CDN / object storage (Supabase Storage). Add your own here.
    remotePatterns: [
      { protocol: "https", hostname: "images.openfoodfacts.org" },
      { protocol: "https", hostname: "world.openfoodfacts.org" },
      { protocol: "https", hostname: "static.openfoodfacts.org" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/**" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
