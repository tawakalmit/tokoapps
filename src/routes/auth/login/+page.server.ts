import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.getSession();
  const next = url.searchParams.get('next') ?? '/';

  if (session) {
    redirect(303, next);
  }

  return { next };
};
