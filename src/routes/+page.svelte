<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { parseNarouNovel } from "@l4ph/web-novel-parser";
  import Dropzone from "svelte-file-dropzone";
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut";
  import { handleFileSelect, files } from "./dropzone-handler";
  import { insertRubyToTextarea, insertEmphasisToTextarea } from "./shortcuts";
  import { isTauriApp } from "$lib/is-tauri-app";

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
      {#if !inputText}
        <Dropzone accept="text/plain" on:drop={(e) => handleFileSelect(e, inputText, textarea)} noClick windowDrop>
          <Textarea
            bind:value={inputText}
            bind:this={textarea}
            placeholder="ファイルをドロップするか、本文を入力してください。"
            class="w-full h-full resize-none"
          />
        </Dropzone>
      {/if}
      {#if inputText || isTauriApp()}
        <Textarea
          bind:value={inputText}
          bind:this={textarea}
          class="w-full h-full resize-none"
        />
      {/if}
    </div>
    <div class="border-border border-r"></div>
    <div class="w-1/2 p-4 overflow-auto">
      <div class="prose dark:prose-invert">
          {@html preview}
      </div>
    </div>
  </div>
</main>
