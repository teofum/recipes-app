import type { LoaderArgs } from '@remix-run/node';
import { db } from '~/server/db.server';
import { notFound } from '~/server/request.server';

export async function loader({ request, params }: LoaderArgs) {
  const image = await db.image.findUnique({
    where: { fileId: params.fileId },
    select: {
      contentType: true,
      file: { select: { blob: true } },
    },
  });
  if (!image) throw notFound({ error: 'Image not found' });

  return new Response(image.file.blob, {
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'max-age=31536000',
    },
  });
}
