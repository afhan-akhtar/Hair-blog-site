import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, hashPassword, isAdministrator } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || !isAdministrator(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdministrator(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { username, name, email, password } = await request.json();

  if (!username?.trim() || !name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const normalizedUsername = username.trim().toLowerCase();

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username: normalizedUsername }, { email: email.trim().toLowerCase() }],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Username or email already exists" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      username: normalizedUsername,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await hashPassword(password),
      role: "collaborator",
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
