import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { data: product } = await locals.supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!product) {
    throw error(404, 'Produk tidak ditemukan');
  }

  return { product };
};
