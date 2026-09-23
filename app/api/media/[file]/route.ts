import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getUploadDir } from "@/lib/site-store";

const TIPOS: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  const filename = path.basename(file);
  const ext = path.extname(filename).toLowerCase();
  if (filename !== file || !TIPOS[ext] || filename.includes("..")) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  const uploadDir = path.resolve(getUploadDir());
  const fullPath = path.resolve(uploadDir, filename);
  const relative = path.relative(uploadDir, fullPath);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  try {
    const data = await fs.readFile(fullPath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": TIPOS[ext],
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("No encontrado", { status: 404 });
  }
}
