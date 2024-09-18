<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { parseNarouNovel } from "@l4ph/web-novel-parser";
  import { shortcut, type ShortcutEventDetail } from "@svelte-put/shortcut";
  import { insertRubyToTextarea} from "./utils/insert-ruby-to-textarea";
  import { insertEmphasisToTextarea } from "./utils/insert-emphasis-to-textarea"
  import * as Dialog from "$lib/components/ui/dialog";
  import Button from "@/components/ui/button/button.svelte";
  import { persist, type PersistentStore, createLocalStorage } from "@macfja/svelte-persistent-store"
  import { writable } from "svelte/store"

  let inputText:PersistentStore<string> = persist(writable(""), createLocalStorage(), "inputText")
  let preview: string = "";
  let textarea: Textarea;
  let open:boolean = true;

  $: preview = parseNarouNovel($inputText);
</script>

<svelte:window
  use:shortcut={{
    trigger: [
      { key: 'i', modifier: 'ctrl', callback: () => {
        const updatedText = insertRubyToTextarea(textarea, $inputText) || $inputText;
        inputText.set(updatedText);}
      },
      { key: 'b', modifier: 'ctrl', callback: insertEmphasisToTextarea },
    ],
  }}
/>

<main class="h-screen">
  {#if $inputText === "" || !inputText}
    <Dialog.Root bind:open>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>"書く"にフォーカスする。</Dialog.Title>
          <Dialog.Description>
            Tawriは、軽量な小説向けのエディタです。
          </Dialog.Description>
        </Dialog.Header>
        <Button on:click={() => open = false}>新しく始める</Button>
        <Button>ファイルを開く</Button>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
  <div class="flex h-full bg-background">
    <div class="w-1/2 p-4 flex flex-col">
      <Textarea
          bind:value={$inputText}
          bind:this={textarea}
          class="w-full h-full resize-none"
      />
    </div>
    <div class="border-border border-r"></div>
    <div class="w-1/2 p-4 overflow-auto hidden-scrollbar">
      <div class="prose dark:prose-invert">
        {@html preview}
      </div>
    </div>
  </div>
</main>