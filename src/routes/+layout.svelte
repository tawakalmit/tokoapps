<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import type { LayoutData } from './$types';

  let { data, children } = $props<{ data: LayoutData; children: any }>();

  const navbarItems = $derived(data.navItems.filter((item) => item.position === 'navbar'));
  const footerItems = $derived(data.navItems.filter((item) => item.position === 'footer'));
</script>

<div class="min-h-screen flex flex-col">
  <Navbar items={navbarItems} session={data.session} />
  <main class="flex-1">
    {@render children()}
  </main>
  <Footer items={footerItems} />
</div>
