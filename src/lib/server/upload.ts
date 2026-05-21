import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET_ICONS = 'icons';
const BUCKET_SCREENSHOTS = 'screenshots';
const BUCKET_APKS = 'apks';

/**
 * Upload a file to Supabase Storage and return the public URL.
 */
export async function uploadFile(
  supabase: SupabaseClient,
  bucket: string,
  file: File,
  folder: string = ''
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error(`Upload error (${bucket}):`, error.message);
    return null;
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData.publicUrl;
}

/**
 * Upload icon image. Returns public URL or null.
 */
export async function uploadIcon(supabase: SupabaseClient, file: File, slug: string): Promise<string | null> {
  return uploadFile(supabase, BUCKET_ICONS, file, slug);
}

/**
 * Upload multiple screenshot images. Returns array of public URLs.
 */
export async function uploadScreenshots(supabase: SupabaseClient, files: File[], slug: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    const url = await uploadFile(supabase, BUCKET_SCREENSHOTS, file, slug);
    if (url) urls.push(url);
  }
  return urls;
}

/**
 * Upload APK file. Returns public URL or null.
 */
export async function uploadApk(supabase: SupabaseClient, file: File, slug: string): Promise<string | null> {
  return uploadFile(supabase, BUCKET_APKS, file, slug);
}
