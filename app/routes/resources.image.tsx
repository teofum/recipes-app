import type { ActionArgs } from '@remix-run/node';
import {
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import { db } from '~/server/db.server';
import withSharp from '~/server/sharp.server';

const MAX_SIZE = 1024 * 1024 * 10;

export const imageUploadFormValidator = withZod(
  z.object({
    file: z.instanceof(File),
    altText: z.string().optional(),
  }),
);

export async function action({ request }: ActionArgs) {
  // Validate content length
  const contentLength = Number(request.headers.get('Content-Length'));
  if (
    contentLength &&
    Number.isFinite(contentLength) &&
    contentLength > MAX_SIZE
  ) {
    return validationError({
      fieldErrors: {
        file: `File size is too large (max ${MAX_SIZE / (1024 * 1024)}MB)`,
      },
    });
  }

  // Parse file data
  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({ maxPartSize: MAX_SIZE }),
  );

  const { data, error } = await imageUploadFormValidator.validate(formData);
  if (error) return validationError(error);

  const buffer = await data.file.arrayBuffer();
  const { data: imageData, info } = await withSharp(buffer)
    .resize(960, 640)
    .webp({ quality: 85 })
    .timeout({ seconds: 5 })
    .toBuffer({ resolveWithObject: true });

  console.log('Processed image:', contentLength, '>', info.size);

  const image = await db.image.create({
    select: { fileId: true },
    data: {
      contentType: data.file.type,
      altText: data.altText,
      file: {
        create: {
          blob: imageData,
        },
      },
    },
  });

  return json({ fileId: image.fileId });
}

export type ImageUploadAction = typeof action;
