import { badRequest } from './request.server';
import withSharp from './sharp.server';
import supabase from './supabase.server';

interface UploadImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  upsert?: boolean;
}

export default async function uploadImage(
  file: File,
  bucket: string,
  url: string,
  options: UploadImageOptions = {},
) {
  const buffer = await file.arrayBuffer();
  const { data, info } = await withSharp(buffer)
    .resize(options.width || 1024, options.height || 1024)
    .webp({ quality: options.quality ?? 85 })
    .timeout({ seconds: 5 })
    .toBuffer({ resolveWithObject: true });

  console.log('Processed image:', info.size);

  const result = await supabase.storage
    .from(bucket)
    .upload(url, data, { upsert: options.upsert ?? false });
  if (result.error) throw result.error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(url);

  return publicUrl;
}

export async function deleteImage(imageUrl: string) {
  const [bucket, url] = imageUrl.split('/').slice(-2);
  if (!bucket || !url) throw badRequest({ message: 'Bad URL' });

  const { data, error } = await supabase.storage.from(bucket).remove([url]);
  if (error) throw error;

  return data[0];
}
