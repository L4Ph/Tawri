<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "@/components/ui/button/button.svelte";
  import { parseNarouNovel } from "@l4ph/web-novel-parser"
  import {shortcut, type ShortcutEventDetail} from "@svelte-put/shortcut"
  import { toast } from "svelte-sonner";

  function isTauriApp(): boolean {
    // @ts-ignore
    return typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;
  }

  let inputText = '';
  let preview = '';
  let textarea: Textarea

  $: preview = parseNarouNovel(inputText);

  function insertRubyToTextarea(_detail: ShortcutEventDetail) {
    if (isTauriApp()) {
      return null;
    }
    const { selectionStart, selectionEnd } = textarea;
    inputText = inputText.slice(0, selectionStart) + '|《》' + inputText.slice(selectionEnd);
  }

  function insertEmphasisToTextarea(detail:ShortcutEventDetail) {
    toast("未実装です。")
  }

</script>

<svelte:window
  use:shortcut={{
    trigger: [
      { key: 'i', modifier: 'ctrl', callback: insertRubyToTextarea},
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