<script lang="ts">
  import { createBrowserClient } from '@supabase/ssr';
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  let loading = $state(false);

  async function loginWithGoogle() {
    loading = true;
    const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(data.next)}`
      }
    });

    if (error) {
      loading = false;
      alert('Gagal login: ' + error.message);
    }
  }
</script>

<svelte:head>
  <title>Masuk - AppStore</title>
  <meta name="description" content="Masuk ke AppStore untuk membeli dan mengelola aplikasi Anda" />
</svelte:head>

<section class="min-h-[60vh] flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="bg-surface rounded-xl border border-outline p-6">
      <div class="text-center mb-6">
        <svg class="w-12 h-12 mx-auto text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H9v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2v1.93M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"/>
        </svg>
        <h1 class="text-xl font-medium text-on-surface mt-3">Masuk ke AppStore</h1>
        <p class="text-sm text-on-surface-variant mt-1">Untuk membeli dan mengelola aplikasi</p>
      </div>

      <button
        onclick={loginWithGoogle}
        disabled={loading}
        class="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-outline rounded-lg text-sm font-medium text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-50"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {loading ? 'Memproses...' : 'Masuk dengan Google'}
      </button>

      <div class="mt-4 text-center">
        <p class="text-xs text-on-surface-variant">
          Dengan masuk, Anda menyetujui Syarat & Ketentuan kami
        </p>
      </div>
    </div>
  </div>
</section>
