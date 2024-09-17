<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { parseNarouNovel } from "@l4ph/web-novel-parser";
  import Dropzone from "svelte-file-dropzone";
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut";
  import { insertRubyToTextarea, insertEmphasisToTextarea } from "./shortcuts";

  let inputText = '';
  let preview = '';
  let textarea: Textarea;

  $: preview = parseNarouNovel(inputText);
</script>

<svelte:window
  use:shortcut={{
    trigger: [
      { key: 'i', modifier: 'ctrl', callback: () => insertRubyToTextarea(textarea, inputText) },
      { key: 'b', modifier: 'ctrl', callback: insertEmphasisToTextarea },
    ],
  }}
/>

<main class="h-screen">
  <div class="flex h-full bg-background">
    <div class="w-1/2 p-4 flex flex-col">
        <Textarea
          bind:value={inputText}
          bind:this={textarea}
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
