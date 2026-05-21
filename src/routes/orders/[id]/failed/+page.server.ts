import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { data: order } = await locals.supabase
    .from('orders')
    .select('*, products(name, slug)')
    .eq('id', params.id)
    .single();

  if (!order) {
    throw error(404, 'Pesanan tidak ditemukan');
  }

  return { order };
};
