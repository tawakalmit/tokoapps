import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const session = await locals.getSession();

  const { data: navItems } = await locals.supabase
    .from('navigation_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  const { data: siteSettings } = await locals.supabase
    .from('site_settings')
    .select('*');

  return {
    session,
    navItems: navItems ?? [],
    siteSettings: siteSettings ?? []
  };
};
