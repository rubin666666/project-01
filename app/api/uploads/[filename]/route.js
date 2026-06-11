import { readUploadedImage } from '@/lib/uploads';

export async function GET(_request, { params }) {
  const { filename } = await params;
  const image = await readUploadedImage(filename);

  if (!image) {
    return Response.json({ message: 'Image not found' }, { status: 404 });
  }

  return new Response(image.data, {
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
