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
  import CodeMirror from "svelte-codemirror-editor"
  import ScrollArea from "@/components/ui/scroll-area/scroll-area.svelte";
  import ScrollAreaScrollbar from "@/components/ui/scroll-area/scroll-area-scrollbar.svelte";
  import { readTextFile } from "./utils/file-render";
  import { FilePen } from 'lucide-svelte';
  import { FilePlus2 } from 'lucide-svelte';

  let inputText:PersistentStore<string> = persist(writable(""), createLocalStorage(), "inputText")
  let preview: string = "";
  let textarea: Textarea;
  let open:boolean = true;
  let fileInput: HTMLInputElement;

  function handleFileChange(event: Event) {
    readTextFile(event, (text: string) => {
      inputText.set(text);
    });
  }
  
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
            <p>Tawriは、軽量な小説向けのエディタです。</p>
            <p><kbd class="kbd-key">Ctrl</kbd> + <kbd class="kbd-key">i</kbd>でルビ / <kbd class="kbd-key">Ctrl</kbd> + <kbd class="kbd-key">b</kbd>で傍点が入力できます。</p>
          </Dialog.Description>
        </Dialog.Header>
        <Button on:click={() => open = false}><FilePlus2 class="mr-2" />新しく書く</Button>
        <Button on:click={() => fileInput.click()}>
          <FilePen class="mr-2" />
          ファイルを開く
          <input type="file" accept=".txt" class="hidden" bind:this={fileInput} on:change={handleFileChange} />
        </Button>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
  <div class="flex h-full bg-background">
    <div class="w-1/2 p-4 flex flex-col">
      <ScrollArea>
        <CodeMirror
          bind:value={$inputText} 
          styles={{
            "&": {
              width: "100%",
              height: "100%",
              resize: "none"
            }
          }}
          nodebounce
        />
      </ScrollArea>
    </div>
    <div class="border-border border-r"></div>
    <div class="w-1/2 p-4 overflow-auto hidden-scrollbar">
      {@html preview}
    </div>
  </div>
</main>