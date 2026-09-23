import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureUploadDir, getUploadDir, listUploadedImages } from "@/lib/site-store";

const FORMATOS_ACEPTADOS = new Set(["jpeg", "png", "webp", "gif", "avif", "tiff"]);

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const images = await listUploadedImages();
  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Máximo 8 MB" }, { status: 400 });
  }

  // No se confía ni en el tipo declarado ni en la extensión del nombre: el
  // archivo se decodifica de verdad. Si sharp no puede leerlo, no es una imagen.
  const entrada = Buffer.from(await file.arrayBuffer());

  let webp: Buffer;
  try {
    const imagen = sharp(entrada, { limitInputPixels: 50_000_000 });
    const meta = await imagen.metadata();
    if (!meta.width || !meta.height || !FORMATOS_ACEPTADOS.has(meta.format ?? "")) {
      return NextResponse.json({ error: "El archivo no es una imagen válida" }, { status: 400 });
    }

    // Reprocesar descarta cualquier cosa que viniera pegada al archivo y
    // elimina los metadatos EXIF, que pueden incluir la ubicación GPS.
    webp = await imagen
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch (error) {
    console.error("[admin/images] archivo rechazado:", error);
    return NextResponse.json({ error: "El archivo no es una imagen válida" }, { status: 400 });
  }

  await ensureUploadDir();

  // La extensión sale del formato que realmente se escribió, no del nombre.
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  await fs.writeFile(path.join(getUploadDir(), filename), webp);

  return NextResponse.json({
    ok: true,
    url: `/images/uploads/${filename}`,
    name: filename,
  });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  const url = body?.url ?? "";
  const filename = path.posix.basename(url);
  const expected = `/images/uploads/${filename}`;
  if (!url || url !== expected || filename !== path.basename(filename) || filename.includes("..")) {
    return NextResponse.json(
      { error: "Solo se pueden eliminar archivos de /images/uploads" },
      { status: 400 },
    );
  }

  const uploadDir = path.resolve(getUploadDir());
  const fullPath = path.resolve(uploadDir, filename);
  const relative = path.relative(uploadDir, fullPath);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return NextResponse.json(
      { error: "Solo se pueden eliminar archivos de /images/uploads" },
      { status: 400 },
    );
  }

  try {
    await fs.unlink(fullPath);
  } catch {
    return NextResponse.json({ error: "No se encontró el archivo" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
