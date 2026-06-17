// Central brand definition so the identity lives in one place.

export const BRAND = {
  name: "NOMI",
  tagline: {
    kk: "Дәмді тамақ — есік алдында",
    ru: "Вкусная еда — у вашей двери",
    en: "Delicious food at your door",
  },
  // Telegram order channel is configured via env vars (see api/orders/route.ts)
  supportPhone: "+7 700 000 00 00",
} as const;
