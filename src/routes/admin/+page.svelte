<script lang="ts">
  import type { PageData, ActionData } from './$types';

  let { data, form } = $props<{ data: PageData; form: ActionData }>();
  let showForm = $state(false);
  let editingProduct = $state<any>(null);
  let iconPreview = $state<string | null>(null);
  let apkFileName = $state<string | null>(null);

  function handleIconPreview(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      iconPreview = URL.createObjectURL(input.files[0]);
    }
  }

  function handleApkSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      apkFileName = input.files[0].name;
    }
  }

  function openEdit(product: any) {
    editingProduct = product;
    showForm = true;
    iconPreview = product.icon_url || null;
    apkFileName = product.apk_url ? product.apk_url.split('/').pop() : null;
  }

  function resetForm() {
    showForm = !showForm;
    editingProduct = null;
    iconPreview = null;
    apkFileName = null;
  }
</script>

<svelte:head>
  <title>Kelola Produk - Admin</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div>
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-medium text-on-surface">Produk ({data.products.length})</h2>
    <button
      onclick={resetForm}
      class="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
    >
      {showForm ? 'Tutup' : '+ Tambah Produk'}
    </button>
  </div>

  {#if form?.error}
    <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Berhasil!</div>
  {/if}

  {#if showForm}
    <div class="bg-surface border border-outline rounded-xl p-6 mb-6">
      <h3 class="font-medium text-on-surface mb-4">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
      <form method="POST" action={editingProduct ? '?/update' : '?/create'} enctype="multipart/form-data" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#if editingProduct}
          <input type="hidden" name="id" value={editingProduct.id} />
          <input type="hidden" name="existing_icon_url" value={editingProduct.icon_url ?? ''} />
          <input type="hidden" name="existing_apk_url" value={editingProduct.apk_url ?? ''} />
          <input type="hidden" name="existing_screenshots" value={editingProduct.screenshots?.join('\n') ?? ''} />
        {/if}

        <div>
          <label for="name" class="block text-xs font-medium text-on-surface-variant mb-1">Nama</label>
          <input type="text" id="name" name="name" required value={editingProduct?.name ?? ''} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label for="slug" class="block text-xs font-medium text-on-surface-variant mb-1">Slug</label>
          <input type="text" id="slug" name="slug" required value={editingProduct?.slug ?? ''} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div class="md:col-span-2">
          <label for="short_description" class="block text-xs font-medium text-on-surface-variant mb-1">Deskripsi Singkat</label>
          <input type="text" id="short_description" name="short_description" required value={editingProduct?.short_description ?? ''} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div class="md:col-span-2">
          <label for="description" class="block text-xs font-medium text-on-surface-variant mb-1">Deskripsi Lengkap</label>
          <textarea id="description" name="description" required rows="4" class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">{editingProduct?.description ?? ''}</textarea>
        </div>
        <div>
          <label for="price" class="block text-xs font-medium text-on-surface-variant mb-1">Harga (Rp)</label>
          <input type="number" id="price" name="price" required value={editingProduct?.price ?? 0} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label for="category" class="block text-xs font-medium text-on-surface-variant mb-1">Kategori</label>
          <input type="text" id="category" name="category" required value={editingProduct?.category ?? ''} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
        <div>
          <label for="version" class="block text-xs font-medium text-on-surface-variant mb-1">Versi</label>
          <input type="text" id="version" name="version" required value={editingProduct?.version ?? '1.0.0'} class="w-full px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>

        <!-- Icon Upload -->
        <div>
          <label for="icon_file" class="block text-xs font-medium text-on-surface-variant mb-1">Icon Aplikasi</label>
          <div class="flex items-center gap-3">
            {#if iconPreview}
              <img src={iconPreview} alt="Icon preview" class="w-12 h-12 rounded-lg object-cover border border-outline" />
            {:else}
              <div class="w-12 h-12 rounded-lg bg-surface-variant border border-outline flex items-center justify-center">
                <svg class="w-6 h-6 text-on-surface-variant/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
            {/if}
            <div class="flex-1">
              <input
                type="file"
                id="icon_file"
                name="icon_file"
                accept="image/*"
                onchange={handleIconPreview}
                class="w-full text-sm text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-outline file:text-xs file:font-medium file:bg-surface-variant file:text-on-surface-variant hover:file:bg-outline/30 file:cursor-pointer"
              />
            </div>
          </div>
        </div>

        <!-- APK Upload -->
        <div>
          <label for="apk_file" class="block text-xs font-medium text-on-surface-variant mb-1">File APK</label>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg bg-surface-variant border border-outline flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 {apkFileName ? 'text-primary' : 'text-on-surface-variant/40'}" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
            </div>
            <div class="flex-1">
              <input
                type="file"
                id="apk_file"
                name="apk_file"
                accept=".apk,.aab,.ipa,.exe,.dmg,.zip"
                onchange={handleApkSelect}
                class="w-full text-sm text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-outline file:text-xs file:font-medium file:bg-surface-variant file:text-on-surface-variant hover:file:bg-outline/30 file:cursor-pointer"
              />
              {#if apkFileName}
                <p class="text-xs text-primary mt-1">{apkFileName}</p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Screenshots Upload -->
        <div class="md:col-span-2">
          <label for="screenshot_files" class="block text-xs font-medium text-on-surface-variant mb-1">Screenshots (bisa pilih banyak file)</label>
          <input
            type="file"
            id="screenshot_files"
            name="screenshot_files"
            accept="image/*"
            multiple
            class="w-full text-sm text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-outline file:text-xs file:font-medium file:bg-surface-variant file:text-on-surface-variant hover:file:bg-outline/30 file:cursor-pointer"
          />
          {#if editingProduct?.screenshots?.length}
            <div class="flex gap-2 mt-2 flex-wrap">
              {#each editingProduct.screenshots as ss}
                <img src={ss} alt="Screenshot" class="h-16 rounded border border-outline object-cover" />
              {/each}
            </div>
            <p class="text-xs text-on-surface-variant mt-1">Upload baru akan ditambahkan ke screenshot yang sudah ada</p>
          {/if}
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" id="is_published" name="is_published" checked={editingProduct?.is_published ?? true} class="rounded" />
          <label for="is_published" class="text-sm text-on-surface">Publish</label>
        </div>
        <div class="md:col-span-2">
          <button type="submit" class="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">
            {editingProduct ? 'Update' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <div class="bg-surface border border-outline rounded-xl overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-surface-variant">
        <tr>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Nama</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Kategori</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Harga</th>
          <th class="text-left px-4 py-3 font-medium text-on-surface-variant">Status</th>
          <th class="text-right px-4 py-3 font-medium text-on-surface-variant">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#each data.products as product}
          <tr class="border-t border-outline">
            <td class="px-4 py-3 text-on-surface">
              <div class="flex items-center gap-2">
                {#if product.icon_url}
                  <img src={product.icon_url} alt="" class="w-8 h-8 rounded-lg object-cover" />
                {/if}
                {product.name}
              </div>
            </td>
            <td class="px-4 py-3 text-on-surface-variant">{product.category}</td>
            <td class="px-4 py-3 text-on-surface-variant">Rp {product.price.toLocaleString('id-ID')}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded-full text-xs {product.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                {product.is_published ? 'Published' : 'Draft'}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                onclick={() => openEdit(product)}
                class="text-primary hover:text-primary-dark text-xs mr-2"
              >Edit</button>
              <form method="POST" action="?/delete" class="inline">
                <input type="hidden" name="id" value={product.id} />
                <button type="submit" class="text-red-500 hover:text-red-700 text-xs" onclick={(e) => { if (!confirm('Hapus produk ini?')) e.preventDefault(); }}>Hapus</button>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
