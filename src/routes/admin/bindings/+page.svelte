<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
  <title>Device Bindings - Admin</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div>
  <h2 class="text-lg font-medium text-on-surface mb-4">Device Bindings ({data.bindings.length})</h2>

  <div class="bg-surface border border-outline rounded-xl overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-surface-variant">
        <tr>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Email</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Produk</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Device ID</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Key</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
          <th class="text-right px-4 py-3 font-medium text-on-surface-variant">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each data.bindings as binding}
          <tr class="border-t border-outline">
            <td class="px-4 py-3 text-on-surface">{binding.customer_email}</td>
            <td class="px-4 py-3 text-on-surface-variant">{(binding as any).products?.name ?? '-'}</td>
            <td class="px-4 py-3 text-on-surface-variant font-mono text-xs">{binding.device_id.substring(0, 12)}...</td>
            <td class="px-4 py-3 text-on-surface-variant font-mono text-xs">{binding.binding_key.substring(0, 12)}...</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs {binding.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                {binding.is_active ? 'Active' : 'Revoked'}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              {#if binding.is_active}
                <form method="POST" action="?/revoke" class="inline">
                  <input type="hidden" name="id" value={binding.id} />
                  <button type="submit" class="text-red-500 hover:text-red-700 text-xs">Revoke</button>
                </form>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
