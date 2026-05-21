import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  if (session) {
    redirect(303, '/admin');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return fail(400, { error: 'Email dan password wajib diisi' });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return fail(401, { error: 'Email atau password salah' });
    }

    redirect(303, '/admin');
  }
};
