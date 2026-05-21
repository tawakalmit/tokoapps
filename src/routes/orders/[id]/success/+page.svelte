<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
  <title>Pembelian Berhasil - AppStore</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-lg mx-auto px-4 py-8">
  <div class="bg-surface rounded-xl border border-outline p-6 text-center">
    <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
      <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h1 class="text-xl font-medium text-on-surface">Pembelian Berhasil!</h1>
    <p class="text-on-surface-variant mt-2 text-sm">Berikut adalah binding key untuk perangkat Anda</p>

    {#if data.binding}
      <div class="mt-6 p-4 bg-surface-variant rounded-lg">
        <p class="text-xs text-on-surface-variant mb-1">Binding Key</p>
        <code class="text-sm font-mono text-on-surface break-all">{data.binding.binding_key}</code>
      </div>
      <p class="text-xs text-on-surface-variant mt-4">
        Masukkan binding key ini di aplikasi untuk mengaktifkannya. Key ini hanya berlaku untuk perangkat dengan Device ID: <code class="font-mono">{data.binding.device_id}</code>
      </p>
    {/if}

    <a href="/" class="inline-block mt-6 text-sm text-primary hover:text-primary-dark">
      Kembali ke beranda
    </a>
  </div>
</section>
