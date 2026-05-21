import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  if (!session) {
    redirect(303, '/auth/login?next=/account');
  }

  const email = session.user.email!;

  const { data: orders } = await locals.supabase
    .from('orders')
    .select('*, products(name, slug, icon_url)')
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  const { data: bindings } = await locals.supabase
    .from('device_bindings')
    .select('*, products(name, slug)')
    .eq('customer_email', email)
    .eq('is_active', true);

  return {
    session,
    orders: orders ?? [],
    bindings: bindings ?? []
  };
};

export const actions: Actions = {
  logout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    redirect(303, '/');
  }
};
