import crypto from 'crypto';
import {
  OtpRecord,
  getActiveOtp,
  getOtps,
  saveOtps,
  saveOtpRecord,
  expireOldOtps,
  normalizePhone,
} from './store';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_ATTEMPTS = 5;
const OTP_MAX_LENGTH = 6;

// Per-phone resend cooldown
const RESEND_COOLDOWN_MS = 60 * 1000;
// Per-phone hourly send budget (rolling window)
const HOURLY_BUDGET = 5;
const HOURLY_WINDOW_MS = 60 * 60 * 1000;

const hourlySends = new Map<string, { count: number; windowStart: number }>();

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function generateOtp(): string {
  return String(crypto.randomInt(100000, 1000000)).padStart(OTP_MAX_LENGTH, '0');
}

function phoneKey(phone: string): string {
  return normalizePhone(phone);
}

export function getResendCooldownMs(phone: string): number {
  const active = getActiveOtp(phone, 'register') || getActiveOtp(phone, 'recover');
  if (!active) return 0;
  const remaining = new Date(active.resendCooldownUntil).getTime() - Date.now();
  return remaining > 0 ? remaining : 0;
}

export function checkSendAllowed(phone: string): { allowed: boolean; retryAfterMs: number; reason?: string } {
  const key = phoneKey(phone);
  const cooldown = getResendCooldownMs(key);
  if (cooldown > 0) {
    return { allowed: false, retryAfterMs: cooldown, reason: 'Please wait before requesting a new OTP.' };
  }
  const now = Date.now();
  const entry = hourlySends.get(key);
  if (entry && now - entry.windowStart < HOURLY_WINDOW_MS && entry.count >= HOURLY_BUDGET) {
    const retryAfterMs = HOURLY_WINDOW_MS - (now - entry.windowStart);
    return { allowed: false, retryAfterMs, reason: 'Too many OTP requests. Try again later.' };
  }
  return { allowed: true, retryAfterMs: 0 };
}

export function recordSend(phone: string) {
  const key = phoneKey(phone);
  const now = Date.now();
  const entry = hourlySends.get(key);
  if (!entry || now - entry.windowStart >= HOURLY_WINDOW_MS) {
    hourlySends.set(key, { count: 1, windowStart: now });
  } else {
    entry.count += 1;
  }
}

// Issue a new OTP for a phone + purpose. Invalidates any previous active OTP
// for the same phone+purpose so only one live OTP exists at a time.
export function issueOtp(phone: string, purpose: 'register' | 'recover'): string {
  expireOldOtps();
  const key = phoneKey(phone);
  const otp = generateOtp();
  const now = Date.now();
  const record: OtpRecord = {
    id: crypto.randomBytes(16).toString('hex'),
    phone: key,
    purpose,
    otpHash: hashOtp(otp),
    expiresAt: new Date(now + OTP_TTL_MS).toISOString(),
    attemptsUsed: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    consumed: false,
    createdAt: new Date(now).toISOString(),
    resendCooldownUntil: new Date(now + RESEND_COOLDOWN_MS).toISOString(),
  };
  // Invalidate any previously issued OTP for the same phone+purpose so only
  // one live code exists at a time.
  const all = getOtps();
  for (const existing of all) {
    if (existing.phone === key && existing.purpose === purpose && !existing.consumed) {
      existing.consumed = true;
    }
  }
  saveOtps(all);
  saveOtpRecord(record);
  recordSend(key);
  return otp;
}

export function verifyOtp(
  phone: string,
  purpose: 'register' | 'recover',
  otp: string
): { ok: boolean; error?: string } {
  const key = phoneKey(phone);
  const record = getActiveOtp(key, purpose);
  if (!record) {
    return { ok: false, error: 'The OTP is invalid or has expired. Please request a new one.' };
  }
  if (record.attemptsUsed >= record.maxAttempts) {
    const next = { ...record, consumed: true };
    saveOtpRecord(next);
    return { ok: false, error: 'Too many incorrect attempts. This OTP has been disabled.' };
  }
  const candidate = hashOtp(String(otp || '').trim());
  if (candidate !== record.otpHash) {
    const next = { ...record, attemptsUsed: record.attemptsUsed + 1 };
    saveOtpRecord(next);
    return { ok: false, error: 'Incorrect OTP. Please check and try again.' };
  }
  const next = { ...record, consumed: true };
  saveOtpRecord(next);
  return { ok: true };
}