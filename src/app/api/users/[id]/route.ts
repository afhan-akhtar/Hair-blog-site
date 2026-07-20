import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createSessionToken,
  getSession,
  isAdministrator,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const isSelf = session.id === id;
  const isAdmin = isAdministrator(session.role);

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!isAdmin) {
    if (!isSelf) {
      return NextResponse.json({ error: "You can only edit your own profile" }, { status: 403 });
    }
    if (target.role === "administrator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (!isSelf && target.role === "administrator") {
    return NextResponse.json({ error: "Administrator profiles cannot be edited here" }, { status: 403 });
  }

  const body = await request.json();
  const name = body.name?.trim();
  const username = body.username?.trim().toLowerCase();
  const email = body.email?.trim().toLowerCase();
  const avatar = body.avatar === "" ? null : body.avatar?.trim() || undefined;
  const bio = body.bio === "" ? null : body.bio?.trim() || undefined;

  if (!name || !username || !email) {
    return NextResponse.json({ error: "Name, username, and email are required" }, { status: 400 });
  }

  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3–30 characters: lowercase letters, numbers, underscores only" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
      NOT: { id },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Username or email already in use" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      name,
      username,
      email,
      ...(avatar !== undefined && { avatar }),
      ...(bio !== undefined && { bio }),
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      bio: true,
    },
  });

  const response = NextResponse.json(updated);

  if (isSelf) {
    const token = await createSessionToken({
      id: updated.id,
      username: updated.username,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar,
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  }

  return response;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !isAdministrator(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (session.id === id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, name: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role !== "collaborator") {
    return NextResponse.json({ error: "Only collaborators can be deleted" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.post.updateMany({ where: { authorId: id }, data: { authorId: null } }),
    prisma.media.updateMany({ where: { uploadedById: id }, data: { uploadedById: null } }),
    prisma.user.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
}
