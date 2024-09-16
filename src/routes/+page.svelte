<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "@/components/ui/button/button.svelte";
  import { parseNarouNovel } from "@l4ph/web-novel-parser";

  let inputText = '';
  let preview = '';

  $: preview = parseNarouNovel(inputText);
</script>

<main class="h-screen">
  <div class="flex h-full bg-background">
    <div class="w-1/2 p-4 flex flex-col">
      <div class="flex">
        <Button class="mr-2 mb-4">ルビ</Button>
        <Button class="ml-2 mb-4">傍点</Button>
      </div>
      <Textarea
        bind:value={inputText}
        placeholder="本文を入力"
        class="w-full h-full resize-none"
      />
    </div>
    <div class="border-border border-r"></div>
    <div class="w-1/2 p-4 overflow-auto">
      <div class="prose dark:prose-invert">
          {@html preview}
      </div>
    </div>
  </div>
</main>