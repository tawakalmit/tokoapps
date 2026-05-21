import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: bindings } = await locals.supabase
    .from('device_bindings')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  return { bindings: bindings ?? [] };
};

export const actions: Actions = {
  revoke: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    const { error } = await locals.supabase
      .from('device_bindings')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      return fail(500, { error: 'Gagal menonaktifkan binding' });
    }

    return { success: true };
  }
};
