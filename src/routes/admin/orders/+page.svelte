<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
  <title>Pesanan - Admin</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div>
  <h2 class="text-lg font-medium text-on-surface mb-4">Pesanan ({data.orders.length})</h2>

  <div class="bg-surface border border-outline rounded-xl overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-surface-variant">
        <tr>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Email</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Produk</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Device ID</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Tanggal</th>
        </tr>
      </thead>
      <tbody>
        {#each data.orders as order}
          <tr class="border-t border-outline">
            <td class="px-4 py-3 text-on-surface">{order.customer_email}</td>
            <td class="px-4 py-3 text-on-surface-variant">{(order as any).products?.name ?? '-'}</td>
            <td class="px-4 py-3 text-on-surface-variant font-mono text-xs">{order.device_id}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs
                {order.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                {order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                {order.status === 'paid' ? 'bg-blue-100 text-blue-700' : ''}
                {order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
              ">
                {order.status}
              </span>
            </td>
            <td class="px-4 py-3 text-on-surface-variant text-xs">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
