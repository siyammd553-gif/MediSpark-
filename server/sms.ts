import dotenv from 'dotenv';

dotenv.config();

// Per the product decision, no real SMS gateway is wired into the app.
// `SMS_PROVIDER`/`SMS_API_URL`/`SMS_API_KEY` may be configured for a
// production deployment via .env; otherwise OTP delivery falls back to a
// development-only mechanism (handled in auth.ts).

export function isSmsConfigured(): boolean {
  return Boolean(process.env.SMS_PROVIDER && process.env.SMS_API_URL);
}

// Attempt to deliver an SMS through the configured HTTP gateway.
// Returns the delivery outcome; the caller decides how to surface it.
export async function sendSms(phone: string, message: string): Promise<{ ok: boolean; provider: string }> {
  if (!isSmsConfigured()) {
    return { ok: false, provider: 'none' };
  }
  const provider = process.env.SMS_PROVIDER || 'http';
  const url = process.env.SMS_API_URL as string;
  const apiKey = process.env.SMS_API_KEY || '';
  const senderId = process.env.SMS_SENDER_ID || '';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, senderId, to: phone, message }),
    });
    return { ok: res.ok, provider };
  } catch (e) {
    console.error(`[sms] Failed to send via ${provider}:`, e);
    return { ok: false, provider };
  }
}