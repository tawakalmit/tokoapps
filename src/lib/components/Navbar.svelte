<script lang="ts">
  import type { NavigationItem } from '$lib/types/database';
  import type { Session } from '@supabase/supabase-js';

  let { items = [], session = null }: { items: NavigationItem[]; session: Session | null } = $props();
  let mobileOpen = $state(false);

  const userAvatar = $derived(session?.user?.user_metadata?.avatar_url);
  const userName = $derived(session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0]);
  const isAdmin = $derived(session?.user?.app_metadata?.role === 'admin' || session?.user?.role === 'authenticated');
</script>

<nav class="bg-surface border-b border-outline sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <a href="/" class="flex items-center gap-2">
        <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H9v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2v1.93M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"/>
        </svg>
        <span class="text-xl font-medium text-on-surface">AppStore</span>
      </a>

      <div class="hidden md:flex items-center gap-6">
        {#each items as item}
          <a href={item.href} class="text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium">
            {item.label}
          </a>
        {/each}

        {#if session}
          <a href="/account" class="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
            {#if userAvatar}
              <img src={userAvatar} alt="" class="w-7 h-7 rounded-full" referrerpolicy="no-referrer" />
            {:else}
              <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-xs text-primary font-medium">{userName?.charAt(0).toUpperCase()}</span>
              </div>
            {/if}
            <span class="hidden lg:inline">{userName}</span>
          </a>
          {#if isAdmin}
            <a href="/admin" class="text-primary hover:text-primary-dark text-sm font-medium">Admin</a>
          {/if}
        {:else}
          <a href="/auth/login" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors">
            Masuk
          </a>
        {/if}
      </div>

      <button
        class="md:hidden p-2 rounded-lg hover:bg-surface-variant"
        onclick={() => (mobileOpen = !mobileOpen)}
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if mobileOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <div class="md:hidden border-t border-outline bg-surface">
      <div class="px-4 py-3 space-y-2">
        {#each items as item}
          <a href={item.href} class="block py-2 text-on-surface-variant hover:text-on-surface text-sm font-medium">
            {item.label}
          </a>
        {/each}
        {#if session}
          <div class="flex items-center gap-2 py-2 border-t border-outline mt-2 pt-3">
            {#if userAvatar}
              <img src={userAvatar} alt="" class="w-7 h-7 rounded-full" referrerpolicy="no-referrer" />
            {:else}
              <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-xs text-primary font-medium">{userName?.charAt(0).toUpperCase()}</span>
              </div>
            {/if}
            <span class="text-sm text-on-surface">{userName}</span>
          </div>
          <a href="/account" class="block py-2 text-on-surface-variant hover:text-on-surface text-sm font-medium">Akun Saya</a>
          {#if isAdmin}
            <a href="/admin" class="block py-2 text-primary text-sm font-medium">Admin</a>
          {/if}
        {:else}
          <a href="/auth/login" class="block py-2 text-primary text-sm font-medium">Masuk</a>
        {/if}
      </div>
    </div>
  {/if}
</nav>
