<script lang="ts">
  import type { PageData, ActionData } from './$types';

  let { data, form } = $props<{ data: PageData; form: ActionData }>();
  let showForm = $state(false);
  let editingItem = $state<any>(null);
</script>

<svelte:head>
  <title>Navigasi - Admin</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div>
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-medium text-on-surface">Item Navigasi ({data.navItems.length})</h2>
    <button
      onclick={() => { showForm = !showForm; editingItem = null; }}
      class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
    >
      {showForm ? 'Tutup' : '+ Tambah Item'}
    </button>
  </div>

  {#if form?.error}
    <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{form.error}</div>
  {/if}

  {#if showForm}
    <div class="bg-surface border border-outline rounded-xl p-6 mb-6">
      <form method="POST" action={editingItem ? '?/update' : '?/create'} class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#if editingItem}
          <input type="hidden" name="id" value={editingItem.id} />
        {/if}
        <div>
          <label for="label" class="block text-xs font-medium text-on-surface-variant mb-1">Label</label>
          <input type="text" id="label" name="label" required value={editingItem?.label ?? ''} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label for="href" class="block text-xs font-medium text-on-surface-variant mb-1">URL</label>
          <input type="text" id="href" name="href" required value={editingItem?.href ?? ''} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label for="position" class="block text-xs font-medium text-on-surface-variant mb-1">Posisi</label>
          <select id="position" name="position" class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option value="navbar" selected={editingItem?.position === 'navbar'}>Navbar</option>
            <option value="footer" selected={editingItem?.position === 'footer'}>Footer</option>
          </select>
        </div>
        <div>
          <label for="sort_order" class="block text-xs font-medium text-on-surface-variant mb-1">Urutan</label>
          <input type="number" id="sort_order" name="sort_order" value={editingItem?.sort_order ?? 0} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" id="is_active" name="is_active" checked={editingItem?.is_active ?? true} class="rounded" />
          <label for="is_active" class="text-sm text-on-surface">Aktif</label>
        </div>
        <div class="md:col-span-2">
          <button type="submit" class="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">
            {editingItem ? 'Update' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <div class="bg-surface border border-outline rounded-xl overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-surface-variant">
        <tr>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Label</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">URL</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Posisi</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Urutan</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
          <th class="text-right px-4 py-3 font-medium text-on-surface-variant">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each data.navItems as item}
          <tr class="border-t border-outline">
            <td class="px-4 py-3 text-on-surface">{item.label}</td>
            <td class="px-4 py-3 text-on-surface-variant">{item.href}</td>
            <td class="px-4 py-3 text-on-surface-variant capitalize">{item.position}</td>
            <td class="px-4 py-3 text-on-surface-variant">{item.sort_order}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs {item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                {item.is_active ? 'Aktif' : 'Nonaktif'}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button onclick={() => { editingItem = item; showForm = true; }} class="text-primary hover:text-primary-dark text-xs mr-2">Edit</button>
              <form method="POST" action="?/delete" class="inline">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" class="text-red-500 hover:text-red-700 text-xs">Hapus</button>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
