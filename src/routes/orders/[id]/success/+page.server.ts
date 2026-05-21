import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { data: order } = await locals.supabase
    .from('orders')
    .select('*, products(*)')
    .eq('id', params.id)
    .single();

  if (!order) {
    throw error(404, 'Pesanan tidak ditemukan');
  }

  const { data: binding } = await locals.supabase
    .from('device_bindings')
    .select('*')
    .eq('product_id', order.product_id)
    .eq('device_id', order.device_id)
    .eq('is_active', true)
    .single();

  return { order, binding };
};
