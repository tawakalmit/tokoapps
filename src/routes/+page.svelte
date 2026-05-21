<script lang="ts">
  import ProductCard from '$lib/components/ProductCard.svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
  <title>AppStore - Toko Aplikasi Premium</title>
  <meta name="description" content="Temukan dan beli aplikasi premium berkualitas tinggi. Semua aplikasi dilindungi dengan device binding untuk keamanan maksimal." />
  <meta property="og:title" content="AppStore - Toko Aplikasi Premium" />
  <meta property="og:description" content="Temukan dan beli aplikasi premium berkualitas tinggi." />
  <meta property="og:type" content="website" />
</svelte:head>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-2xl font-medium text-on-surface">Aplikasi Pilihan</h1>
    <p class="text-on-surface-variant mt-1">Temukan aplikasi premium yang aman dengan device binding</p>
  </div>

  {#if data.products.length === 0}
    <div class="text-center py-16">
      <svg class="w-16 h-16 mx-auto text-on-surface-variant/40" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m7 14l5-5-1.41-1.41L12 14.17l-2.59-2.58L8 13l4 4Z"/>
      </svg>
      <p class="mt-4 text-on-surface-variant">Belum ada produk tersedia</p>
    </div>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {#each data.products as product}
        <ProductCard {product} />
      {/each}
    </div>
  {/if}
</section>
