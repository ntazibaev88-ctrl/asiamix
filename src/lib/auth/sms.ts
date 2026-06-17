// SMS sender abstraction. Uses a real provider when configured (e.g. Mobizon /
// SMSC / Twilio via env), otherwise returns the code for demo use. The raw code
// is NEVER stored — only its HMAC hash travels in a signed cookie.

export async function sendSms(
  phone: string,
  code: string,
): Promise<{ delivered: boolean; demoCode?: string }> {
  const url = process.env.SMS_API_URL;
  const apiKey = process.env.SMS_API_KEY;

  if (url && apiKey) {
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          recipient: phone,
          text: `NOMI код: ${code}`,
        }),
      });
      return { delivered: true };
    } catch {
      return { delivered: false };
    }
  }

  // No provider configured → demo mode (outside production, or when the
  // NOMI_DEMO flag is set so the deployed demo stays testable).
  if (process.env.NODE_ENV !== "production" || process.env.NOMI_DEMO === "1") {
    return { delivered: false, demoCode: code };
  }
  return { delivered: false };
}
