import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ensureAdminSeed, findUserByEmail, createUser } from "@/lib/local-db";

const cookieName = "ing_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-only-change-in-production-ing-secret",
);

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(cookieName);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
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
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  await ensureAdminSeed(await hashPassword(adminPassword));
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return user;
}
