<script lang="ts">
  import type { PageData, ActionData } from './$types';

  let { data, form } = $props<{ data: PageData; form: ActionData }>();
  const product = $derived(data.product);
</script>

<svelte:head>
  <title>Beli {product.name} - AppStore</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-lg mx-auto px-4 py-8">
  <nav class="mb-6">
    <a href="/products/{product.slug}" class="text-sm text-primary hover:text-primary-dark">&larr; Kembali ke detail produk</a>
  </nav>

  <div class="bg-surface rounded-xl border border-outline p-6">
    <div class="flex items-center gap-4 mb-6">
      {#if product.icon_url}
        <img src={product.icon_url} alt={product.name} class="w-16 h-16 rounded-xl object-cover" />
      {:else}
        <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m7 14l5-5-1.41-1.41L12 14.17l-2.59-2.58L8 13l4 4Z"/>
          </svg>
        </div>
      {/if}
      <div>
        <h1 class="text-lg font-medium text-on-surface">{product.name}</h1>
        <p class="text-primary font-medium">
          {product.price === 0 ? 'Gratis' : `Rp ${product.price.toLocaleString('id-ID')}`}
        </p>
      </div>
    </div>

    <!-- User info from session -->
    <div class="mb-4 p-3 bg-surface-variant rounded-lg flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      <div>
        <p class="text-sm text-on-surface font-medium">{data.userEmail}</p>
        <p class="text-xs text-on-surface-variant">Akun Google terhubung</p>
      </div>
    </div>

    {#if form?.error}
      <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        {form.error}
      </div>
    {/if}

    <form method="POST" class="space-y-4">
      <div>
        <label for="device_id" class="block text-sm font-medium text-on-surface mb-1">Device ID</label>
        <input
          type="text"
          id="device_id"
          name="device_id"
          required
          placeholder="Masukkan Device ID dari aplikasi"
          class="w-full px-4 py-2.5 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <p class="text-xs text-on-surface-variant mt-1">
          Device ID bisa didapatkan dari menu Settings di aplikasi Anda
        </p>
      </div>

      <button
        type="submit"
        class="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
      >
        {product.price === 0 ? 'Dapatkan Gratis' : 'Bayar dengan Xendit'}
      </button>

      {#if product.price > 0}
        <p class="text-xs text-center text-on-surface-variant">
          Anda akan diarahkan ke halaman pembayaran Xendit
        </p>
      {/if}
    </form>
  </div>
</section>
