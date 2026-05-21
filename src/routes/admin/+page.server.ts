import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { uploadIcon, uploadScreenshots, uploadApk } from '$lib/server/upload';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: products } = await locals.supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return { products: products ?? [] };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const short_description = formData.get('short_description') as string;
    const price = Number(formData.get('price'));
    const version = formData.get('version') as string;
    const category = formData.get('category') as string;
    const is_published = formData.get('is_published') === 'on';

    // Handle file uploads
    const iconFile = formData.get('icon_file') as File;
    const apkFile = formData.get('apk_file') as File;
    const screenshotFiles = formData.getAll('screenshot_files') as File[];

    let icon_url = '';
    let apk_url = '';
    let screenshots: string[] = [];

    if (iconFile && iconFile.size > 0) {
      const url = await uploadIcon(locals.supabase, iconFile, slug);
      if (url) icon_url = url;
    }

    if (apkFile && apkFile.size > 0) {
      const url = await uploadApk(locals.supabase, apkFile, slug);
      if (url) apk_url = url;
    }

    if (screenshotFiles.length > 0) {
      screenshots = await uploadScreenshots(locals.supabase, screenshotFiles, slug);
    }

    const { error } = await locals.supabase.from('products').insert({
      name, slug, description, short_description, price,
      icon_url, screenshots, apk_url, version, category, is_published
    });

    if (error) {
      return fail(500, { error: `Gagal membuat produk: ${error.message}` });
    }

    return { success: true };
  },

  update: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const short_description = formData.get('short_description') as string;
    const price = Number(formData.get('price'));
    const version = formData.get('version') as string;
    const category = formData.get('category') as string;
    const is_published = formData.get('is_published') === 'on';

    // Handle file uploads
    const iconFile = formData.get('icon_file') as File;
    const apkFile = formData.get('apk_file') as File;
    const screenshotFiles = formData.getAll('screenshot_files') as File[];

    // Keep existing URLs if no new file uploaded
    const existingIconUrl = formData.get('existing_icon_url') as string;
    const existingApkUrl = formData.get('existing_apk_url') as string;
    const existingScreenshots = (formData.get('existing_screenshots') as string || '')
      .split('\n')
      .filter(Boolean);

    let icon_url = existingIconUrl || '';
    let apk_url = existingApkUrl || '';
    let screenshots: string[] = existingScreenshots;

    if (iconFile && iconFile.size > 0) {
      const url = await uploadIcon(locals.supabase, iconFile, slug);
      if (url) icon_url = url;
    }

    if (apkFile && apkFile.size > 0) {
      const url = await uploadApk(locals.supabase, apkFile, slug);
      if (url) apk_url = url;
    }

    if (screenshotFiles.length > 0 && screenshotFiles[0].size > 0) {
      const newScreenshots = await uploadScreenshots(locals.supabase, screenshotFiles, slug);
      if (newScreenshots.length > 0) {
        screenshots = [...screenshots, ...newScreenshots];
      }
    }

    const { error } = await locals.supabase
      .from('products')
      .update({
        name, slug, description, short_description, price,
        icon_url, screenshots, apk_url, version, category, is_published
      })
      .eq('id', id);

    if (error) {
      return fail(500, { error: `Gagal update produk: ${error.message}` });
    }

    return { success: true };
  },

  delete: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    const { error } = await locals.supabase.from('products').delete().eq('id', id);

    if (error) {
      return fail(500, { error: `Gagal hapus produk: ${error.message}` });
    }

    return { success: true };
  }
};
