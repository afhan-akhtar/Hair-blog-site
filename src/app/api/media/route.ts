import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getUploadPaths, sanitizeFilename, validateMediaFile } from "@/lib/media";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();
  const media = await prisma.media.findMany({
    where: q
      ? {
          OR: [
            { filename: { contains: q } },
            { alt: { contains: q } },
            { title: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(media);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validationError = validateMediaFile(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { relativePath, absoluteDir, absolutePath, filename } = getUploadPaths(
    sanitizeFilename(file.name)
  );

  await mkdir(absoluteDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(bytes));

  const alt = (formData.get("alt") as string | null)?.trim() || null;

  const media = await prisma.media.create({
    data: {
      filename: file.name || filename,
      url: relativePath,
      mimeType: file.type,
      fileSize: file.size,
      alt,
      uploadedById: session.id,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
