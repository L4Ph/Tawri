<script lang="ts">
  import "../app.css";
  import { Toaster } from "$lib/components/ui/sonner";
  import '@fontsource-variable/m-plus-2';
  import { ModeWatcher } from "mode-watcher";
  import { page } from '$app/stores';
</script>

<Toaster />
<ModeWatcher />
<slot />

<svelte:head>
  <meta property="og:title" content="Tawri - Web小説向けエディタ" />
  <meta property="og:site_name" content="Tawri - Web小説向けエディタ" />
  <meta property="og:description" content="速い、軽い、シームレスなWeb小説向けエディタ" />
  <meta property="og:url" content="https://tawri.l4ph.moe" />
  <meta property="og:image" content="{$page.url.origin}/og-image.jpg" />
  <meta property="og:type" content="website" />
  <meta name="twitter:site" content="@R0u9h" />
  <meta name="twitter:creator" content="@R0u9h" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>