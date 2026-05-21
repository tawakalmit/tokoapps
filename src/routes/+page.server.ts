import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: products } = await locals.supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return {
    products: products ?? []
  };
};
