<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  const product = $derived(data.product);
</script>

<svelte:head>
  <title>{product.name} - AppStore</title>
  <meta name="description" content={product.short_description} />
  <meta property="og:title" content={`${product.name} - AppStore`} />
  <meta property="og:description" content={product.short_description} />
  <meta property="og:type" content="product" />
  {#if product.icon_url}
    <meta property="og:image" content={product.icon_url} />
  {/if}
</svelte:head>

<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <nav class="mb-6">
    <a href="/" class="text-sm text-primary hover:text-primary-dark">&larr; Kembali ke beranda</a>
  </nav>

  <div class="bg-surface rounded-xl border border-outline overflow-hidden">
    <div class="p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="shrink-0">
          {#if product.icon_url}
            <img src={product.icon_url} alt={product.name} class="w-28 h-28 rounded-2xl object-cover" />
          {:else}
            <div class="w-28 h-28 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg class="w-14 h-14 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m7 14l5-5-1.41-1.41L12 14.17l-2.59-2.58L8 13l4 4Z"/>
              </svg>
            </div>
          {/if}
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-medium text-on-surface">{product.name}</h1>
          <p class="text-on-surface-variant mt-1">{product.short_description}</p>
          <div class="flex items-center gap-3 mt-4">
            <span class="text-xs bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full">{product.category}</span>
            <span class="text-xs text-on-surface-variant">v{product.version}</span>
          </div>
          <div class="mt-6 flex items-center gap-4">
            <span class="text-2xl font-medium text-primary">
              {product.price === 0 ? 'Gratis' : `Rp ${product.price.toLocaleString('id-ID')}`}
            </span>
            <a
              href="/products/{product.slug}/purchase"
              class="inline-flex items-center px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-dark transition-colors"
            >
              Beli Sekarang
            </a>
          </div>
        </div>
      </div>
    </div>

    {#if product.screenshots && product.screenshots.length > 0}
      <div class="border-t border-outline p-6 sm:p-8">
        <h2 class="text-lg font-medium text-on-surface mb-4">Screenshot</h2>
        <div class="flex gap-3 overflow-x-auto pb-2">
          {#each product.screenshots as screenshot}
            <img src={screenshot} alt="Screenshot" class="h-64 rounded-lg border border-outline object-cover" />
          {/each}
        </div>
      </div>
    {/if}

    <div class="border-t border-outline p-6 sm:p-8">
      <h2 class="text-lg font-medium text-on-surface mb-4">Deskripsi</h2>
      <div class="prose prose-sm text-on-surface-variant max-w-none">
        <p class="whitespace-pre-line">{product.description}</p>
      </div>
    </div>

    <div class="border-t border-outline p-6 sm:p-8 bg-surface-variant/50">
      <h2 class="text-lg font-medium text-on-surface mb-2">Tentang Device Binding</h2>
      <p class="text-sm text-on-surface-variant">
        Aplikasi ini dilindungi dengan sistem device binding. Setelah pembelian, Anda akan mendapatkan
        binding key yang hanya berfungsi di perangkat Anda. Aplikasi tidak dapat digunakan di perangkat lain
        tanpa pembelian ulang.
      </p>
    </div>
  </div>
</article>
