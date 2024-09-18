<script lang="ts">
  import "../app.css";
  import { Toaster } from "$lib/components/ui/sonner";
  import '@fontsource-variable/m-plus-2';
  import { ModeWatcher } from "mode-watcher";
</script>

<Toaster />
<ModeWatcher />
<slot />