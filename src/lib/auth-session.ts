import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "ing_session";
export const SESSION_FALLBACK_SECRET =
  "dev-only-change-in-production-ing-secret";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
};

function secretKeys() {
  const fromEnv = process.env.AUTH_SECRET?.trim();
  const keys = fromEnv ? [fromEnv, SESSION_FALLBACK_SECRET] : [SESSION_FALLBACK_SECRET];
  return [...new Set(keys)];
}

function encodeSecret(value: string) {
  return new TextEncoder().encode(value);
}

export function sessionCookieOptions(request?: Request) {
  const proto =
    request?.headers.get("x-forwarded-proto") ??
    (typeof request?.url === "string" && request.url.startsWith("https://")
      ? "https"
      : "");
  const https =
    proto === "https" ||
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: https,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function signSessionToken(user: SessionUser) {
  const secret = encodeSecret(secretKeys()[0]);
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  let lastError: unknown;
  for (const key of secretKeys()) {
    try {
      const { payload } = await jwtVerify(token, encodeSecret(key));
      return {
        id: String(payload.sub ?? ""),
        email: String(payload.email ?? ""),
        name: String(payload.name ?? ""),
        role: payload.role as SessionUser["role"],
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Invalid session");
}
