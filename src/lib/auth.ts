import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminCredentials } from "@/config/admin";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  signSessionToken,
  verifySessionToken,
  type SessionUser,
} from "@/lib/auth-session";
import {
  syncAdminAccount,
  findUserByEmail,
  createUser,
} from "@/lib/local-db";

export { SESSION_COOKIE, signSessionToken, type SessionUser };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function attachSessionCookie(
  response: NextResponse,
  token: string,
  request?: Request,
) {
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(request));
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

export async function createSession(user: SessionUser, request?: Request) {
  const token = await signSessionToken(user);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions(request));
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
    return await verifySessionToken(token);
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
