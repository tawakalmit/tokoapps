import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: orders } = await locals.supabase
    .from('orders')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  return { orders: orders ?? [] };
};
