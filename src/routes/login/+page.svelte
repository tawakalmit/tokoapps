<script lang="ts">
  import type { ActionData } from './$types';

  let { form } = $props<{ form: ActionData }>();
</script>

<svelte:head>
  <title>Login Admin - AppStore</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="min-h-[60vh] flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="bg-surface rounded-xl border border-outline p-6">
      <h1 class="text-xl font-medium text-on-surface text-center mb-6">Login Admin</h1>

      {#if form?.error}
        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {form.error}
        </div>
      {/if}

      <form method="POST" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-on-surface mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            class="w-full px-4 py-2.5 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-on-surface mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            class="w-full px-4 py-2.5 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Masuk
        </button>
      </form>
    </div>
  </div>
</section>
