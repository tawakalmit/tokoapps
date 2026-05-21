<script lang="ts">
  import type { Product } from '$lib/types/database';

  let { product }: { product: Product } = $props();
</script>

<a href="/products/{product.slug}" class="group block bg-surface rounded-xl border border-outline hover:shadow-lg transition-all duration-200 overflow-hidden">
  <div class="aspect-square bg-surface-variant flex items-center justify-center p-6">
    {#if product.icon_url}
      <img src={product.icon_url} alt={product.name} class="w-24 h-24 rounded-2xl object-cover group-hover:scale-110 transition-transform" />
    {:else}
      <div class="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
        <svg class="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m7 14l5-5-1.41-1.41L12 14.17l-2.59-2.58L8 13l4 4Z"/>
        </svg>
      </div>
    {/if}
  </div>
  <div class="p-4">
    <h3 class="font-medium text-on-surface text-sm truncate">{product.name}</h3>
    <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">{product.short_description}</p>
    <div class="flex items-center justify-between mt-3">
      <span class="text-sm font-medium text-primary">
        {product.price === 0 ? 'Gratis' : `Rp ${product.price.toLocaleString('id-ID')}`}
      </span>
      <span class="text-xs text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-full">{product.category}</span>
    </div>
  </div>
</a>
