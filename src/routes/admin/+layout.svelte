<script lang="ts">
  import type { LayoutData } from './$types';

  let { data, children } = $props<{ data: LayoutData; children: any }>();
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div class="flex items-center justify-between mb-8">
    <h1 class="text-xl font-medium text-on-surface">Dashboard Admin</h1>
    <form method="POST" action="/logout?/default">
      <button type="submit" class="text-sm text-on-surface-variant hover:text-on-surface">Logout</button>
    </form>
  </div>

  <nav class="flex gap-1 mb-6 border-b border-outline">
    <a href="/admin" class="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-primary transition-colors">
      Produk
    </a>
    <a href="/admin/orders" class="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-primary transition-colors">
      Pesanan
    </a>
    <a href="/admin/bindings" class="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-primary transition-colors">
      Bindings
    </a>
    <a href="/admin/navigation" class="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface border-b-2 border-transparent hover:border-primary transition-colors">
      Navigasi
    </a>
  </nav>

  {@render children()}
</div>
