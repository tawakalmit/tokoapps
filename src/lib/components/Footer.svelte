<script lang="ts">
  import type { NavigationItem } from '$lib/types/database';

  let { items = [] }: { items: NavigationItem[] } = $props();
</script>

<footer class="bg-surface border-t border-outline mt-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H9v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2v1.93M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"/>
        </svg>
        <span class="text-sm text-on-surface-variant">&copy; {new Date().getFullYear()} AppStore. All rights reserved.</span>
      </div>
      <nav class="flex flex-wrap gap-4">
        {#each items as item}
          <a href={item.href} class="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
            {item.label}
          </a>
        {/each}
      </nav>
    </div>
  </div>
</footer>
