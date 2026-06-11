import 'server-only';

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_DIRECTORY = path.join(process.cwd(), '.data', 'uploads');
const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = Object.keys(IMAGE_TYPES);

export async function saveUploadedImage(file) {
  const extension = IMAGE_TYPES[file.type];
  const filename = `${randomUUID()}.${extension}`;
  await mkdir(UPLOAD_DIRECTORY, { recursive: true });
  await writeFile(
    path.join(UPLOAD_DIRECTORY, filename),
    Buffer.from(await file.arrayBuffer())
  );
  return `/api/uploads/${filename}`;
}

export async function readUploadedImage(filename) {
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(filename)) return null;

  try {
    const extension = path.extname(filename).slice(1);
    const contentType =
      extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
    const data = await readFile(path.join(UPLOAD_DIRECTORY, filename));
    return { contentType, data };
  } catch {
    return null;
  }
}

export async function deleteUploadedImage(url) {
  const filename = url?.startsWith('/api/uploads/') ? path.basename(url) : null;
  if (!filename) return;

  try {
    await unlink(path.join(UPLOAD_DIRECTORY, filename));
  } catch {
    // The recipe can still be deleted if its optional image is already absent.
  }
}
