<script lang="ts">
import "../app.pcss";
import { Toaster } from "$lib/components/ui/sonner/index.js";
import "@fontsource-variable/m-plus-2";
let { children } = $props();
</script>

<Toaster />
{@render children?.()}