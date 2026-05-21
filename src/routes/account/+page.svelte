<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  const user = $derived(data.session?.user);
  const avatar = $derived(user?.user_metadata?.avatar_url);
  const fullName = $derived(user?.user_metadata?.full_name || user?.email);
</script>

<svelte:head>
  <title>Akun Saya - AppStore</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Profile Header -->
  <div class="bg-surface rounded-xl border border-outline p-6 mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        {#if avatar}
          <img src={avatar} alt="" class="w-14 h-14 rounded-full" referrerpolicy="no-referrer" />
        {:else}
          <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="text-xl text-primary font-medium">{fullName?.charAt(0).toUpperCase()}</span>
          </div>
        {/if}
        <div>
          <h1 class="text-lg font-medium text-on-surface">{fullName}</h1>
          <p class="text-sm text-on-surface-variant">{user?.email}</p>
        </div>
      </div>
      <form method="POST" action="?/logout">
        <button type="submit" class="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface border border-outline rounded-lg hover:bg-surface-variant transition-colors">
          Logout
        </button>
      </form>
    </div>
  </div>

  <!-- Active Bindings -->
  <div class="mb-6">
    <h2 class="text-lg font-medium text-on-surface mb-3">Aplikasi Saya</h2>
    {#if data.bindings.length === 0}
      <div class="bg-surface border border-outline rounded-xl p-6 text-center">
        <p class="text-on-surface-variant text-sm">Belum ada aplikasi yang dibeli</p>
        <a href="/" class="inline-block mt-3 text-sm text-primary hover:text-primary-dark">Jelajahi Aplikasi</a>
      </div>
    {:else}
      <div class="grid gap-3">
        {#each data.bindings as binding}
          <div class="bg-surface border border-outline rounded-xl p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-on-surface text-sm">{(binding as any).products?.name}</h3>
                <p class="text-xs text-on-surface-variant mt-0.5">Device: <code class="font-mono">{binding.device_id.substring(0, 16)}...</code></p>
              </div>
              <div class="text-right">
                <span class="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Aktif</span>
              </div>
            </div>
            <div class="mt-3 p-2 bg-surface-variant rounded-lg">
              <p class="text-xs text-on-surface-variant">Binding Key:</p>
              <code class="text-xs font-mono text-on-surface break-all">{binding.binding_key}</code>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Order History -->
  <div>
    <h2 class="text-lg font-medium text-on-surface mb-3">Riwayat Pesanan</h2>
    {#if data.orders.length === 0}
      <div class="bg-surface border border-outline rounded-xl p-6 text-center">
        <p class="text-on-surface-variant text-sm">Belum ada riwayat pesanan</p>
      </div>
    {:else}
      <div class="bg-surface border border-outline rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-surface-variant">
            <tr>
              <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Produk</th>
              <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Harga</th>
              <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
              <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {#each data.orders as order}
              <tr class="border-t border-outline">
                <td class="px-4 py-3 text-on-surface">
                  <div class="flex items-center gap-2">
                    {#if (order as any).products?.icon_url}
                      <img src={(order as any).products.icon_url} alt="" class="w-6 h-6 rounded" />
                    {/if}
                    {(order as any).products?.name ?? '-'}
                  </div>
                </td>
                <td class="px-4 py-3 text-on-surface-variant">
                  {order.amount === 0 ? 'Gratis' : `Rp ${order.amount.toLocaleString('id-ID')}`}
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs
                    {order.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                    {order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                    {order.status === 'paid' ? 'bg-blue-100 text-blue-700' : ''}
                    {order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                  ">
                    {order.status === 'completed' ? 'Selesai' : order.status === 'pending' ? 'Menunggu' : order.status === 'cancelled' ? 'Dibatalkan' : order.status}
                  </span>
                </td>
                <td class="px-4 py-3 text-on-surface-variant text-xs">
                  {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</section>
