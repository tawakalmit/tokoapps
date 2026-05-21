<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
  <title>Pembayaran Gagal - AppStore</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-lg mx-auto px-4 py-8">
  <div class="bg-surface rounded-xl border border-outline p-6 text-center">
    <div class="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
      <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h1 class="text-xl font-medium text-on-surface">Pembayaran Gagal</h1>
    <p class="text-on-surface-variant mt-2 text-sm">
      Pembayaran untuk pesanan ini tidak berhasil atau telah kedaluwarsa.
    </p>

    <div class="mt-6 flex flex-col gap-2">
      {#if (data.order as any).products?.slug}
        <a
          href="/products/{(data.order as any).products.slug}/purchase"
          class="inline-block px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Coba Lagi
        </a>
      {/if}
      <a href="/" class="inline-block text-sm text-primary hover:text-primary-dark">
        Kembali ke beranda
      </a>
    </div>
  </div>
</section>
