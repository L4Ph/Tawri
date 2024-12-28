<script lang="ts">
import "../app.pcss";
import { Toaster } from "$lib/components/ui/sonner/index.js";
import "@fontsource-variable/m-plus-2";
import { ModeWatcher } from "mode-watcher";
let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
{@render children?.()}
