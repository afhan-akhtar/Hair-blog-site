import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE,
  getSessionCookieOptions,
  SESSION_MAX_AGE_SHORT,
  SESSION_MAX_AGE_REMEMBER,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password, rememberMe } = await request.json();

  if (!username?.trim() || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username: username.trim().toLowerCase() },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const maxAge = rememberMe ? SESSION_MAX_AGE_REMEMBER : SESSION_MAX_AGE_SHORT;

  const token = await createSessionToken(
    {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    maxAge
  );

  const response = NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  });

  response.cookies.set(SESSION_COOKIE, token, getSessionCookieOptions(!!rememberMe));
  return response;
}
