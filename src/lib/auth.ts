import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "hair_admin_session";
export const SESSION_MAX_AGE_SHORT = 60 * 60 * 24; // 1 day
export const SESSION_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30; // 30 days

export type SessionUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
};

function getSecret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET || "hair-blog-dev-secret-change-in-production"
  );
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser, maxAge = SESSION_MAX_AGE_REMEMBER) {
  return new SignJWT({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(getSecret());
}

export async function getSessionFromToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: payload.id as string,
      username: payload.username as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
      avatar: (payload.avatar as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionFromToken(token);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionFromToken(token);
}

export function canPublish(role: string) {
  return role === "administrator";
}

export function isAdministrator(role: string) {
  return role === "administrator";
}

export function sanitizePostStatus(role: string, requestedStatus: string) {
  if (!canPublish(role)) return "draft";
  return requestedStatus || "draft";
}

export function getSessionCookieOptions(rememberMe = false) {
  const maxAge = rememberMe ? SESSION_MAX_AGE_REMEMBER : SESSION_MAX_AGE_SHORT;
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export const sessionCookieOptions = getSessionCookieOptions(true);
