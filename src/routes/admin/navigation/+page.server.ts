import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: navItems } = await locals.supabase
    .from('navigation_items')
    .select('*')
    .order('sort_order');

  return { navItems: navItems ?? [] };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const formData = await request.formData();
    const label = formData.get('label') as string;
    const href = formData.get('href') as string;
    const position = formData.get('position') as 'navbar' | 'footer';
    const sort_order = Number(formData.get('sort_order'));
    const is_active = formData.get('is_active') === 'on';

    const { error } = await locals.supabase.from('navigation_items').insert({
      label, href, position, sort_order, is_active
    });

    if (error) {
      return fail(500, { error: `Gagal membuat item: ${error.message}` });
    }
    return { success: true };
  },

  update: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const label = formData.get('label') as string;
    const href = formData.get('href') as string;
    const position = formData.get('position') as 'navbar' | 'footer';
    const sort_order = Number(formData.get('sort_order'));
    const is_active = formData.get('is_active') === 'on';

    const { error } = await locals.supabase
      .from('navigation_items')
      .update({ label, href, position, sort_order, is_active })
      .eq('id', id);

    if (error) {
      return fail(500, { error: `Gagal update item: ${error.message}` });
    }
    return { success: true };
  },

  delete: async ({ request, locals }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    const { error } = await locals.supabase.from('navigation_items').delete().eq('id', id);

    if (error) {
      return fail(500, { error: `Gagal hapus item: ${error.message}` });
    }
    return { success: true };
  }
};
