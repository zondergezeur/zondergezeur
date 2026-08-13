import { createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "zg_admin";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export { cookieName, sessionMaxAgeSeconds };

export function hasAdminConfig() {
  return Boolean(process.env.ADMIN_PASSWORD && getSessionSecret());
}

export function verifyPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    return false;
  }

  return safeEqual(password, configuredPassword);
}

export function createAdminSessionToken() {
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token || !hasAdminConfig()) {
    return false;
  }

  const [expiresAt, signature] = token.split(".");

  if (!expiresAt || !signature) {
    return false;
  }

  const expiresAtNumber = Number(expiresAt);

  if (!Number.isFinite(expiresAtNumber) || Date.now() > expiresAtNumber) {
    return false;
  }

  return safeEqual(signature, sign(expiresAt));
}
