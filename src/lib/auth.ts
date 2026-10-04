import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminCredentials } from "@/config/admin";
import {
  syncAdminAccount,
  findUserByEmail,
  createUser,
} from "@/lib/local-db";

export const SESSION_COOKIE = "ing_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-only-change-in-production-ing-secret",
);

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
};

export function sessionCookieOptions(requestUrl?: string) {
  const https = Boolean(requestUrl?.startsWith("https://"));
  return {
    httpOnly: true,
    secure: https,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(user: SessionUser) {
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

export function attachSessionCookie(
  response: NextResponse,
  token: string,
  requestUrl?: string,
) {
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(requestUrl));
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function createSession(user: SessionUser) {
  const token = await signSessionToken(user);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions());
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as SessionUser["role"],
    };
  } catch {
    return null;
  }
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new Error("Email already registered");
  const passwordHash = await hashPassword(input.password);
  const user = {
    id: `u_${Date.now()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    phone: input.phone,
    role: "CUSTOMER" as const,
  };
  await createUser(user);
  return user;
}

export async function loginUser(email: string, password: string) {
  const admin = getAdminCredentials();
  const incomingEmail = email.trim().toLowerCase();

  if (incomingEmail === admin.email && password === admin.password) {
    void (async () => {
      await syncAdminAccount({
        email: admin.email,
        name: admin.name,
        passwordHash: await hashPassword(admin.password),
      });
    })().catch(() => undefined);

    return {
      id: "admin-1",
      email: admin.email,
      name: admin.name,
      role: "ADMIN" as const,
    };
  }

  const user = await findUserByEmail(incomingEmail);
  if (!user || user.role === "ADMIN") return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return user;
}
