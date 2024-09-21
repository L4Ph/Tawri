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
  import { readTextFile } from "./utils/file-render";
  import { FilePen } from 'lucide-svelte';
  import { FilePlus2 } from 'lucide-svelte';
  import { Separator } from "@/components/ui/separator";
  import { generateCompressedNovelUrl } from "./utils/generate-compressed-novel-url";
  import { toast } from "svelte-sonner";
  import * as ContextMenu from "$lib/components/ui/context-menu";
  import { page } from "$app/stores";
  import { generateSearchParamsToText } from "./utils/generate-search-params-to-text";

  let inputText:PersistentStore<string> = persist(writable(""), createLocalStorage(), "inputText")
  let preview: string = "";
  let textarea: Textarea;
  let open:boolean = true;
  let fileInput: HTMLInputElement;

  let urlSearchParams = $page.url.searchParams;
  if(urlSearchParams) {
    const result = generateSearchParamsToText(urlSearchParams);
    if(result) {
      inputText.set(result)
    }
  }

  function handleFileChange(event: Event) {
    readTextFile(event, (text: string) => {
      inputText.set(text);
    });
  }

  function CopyUrlToClipboard(inputText: string) {
    const url = generateCompressedNovelUrl(inputText);
    navigator.clipboard.writeText(url);
  }
  
  $: preview = parseNarouNovel($inputText);
</script>

<svelte:window
  use:shortcut={{
    trigger: [
      { 
        key: 'i', 
        modifier: 'ctrl', 
        callback: () => {
          const updatedText = insertRubyToTextarea(textarea, $inputText) || $inputText;
          inputText.set(updatedText);
        }
      },
      { 
        key: 'b', 
        modifier: 'ctrl', 
        callback: () => {
          const updatedText = insertEmphasisToTextarea(textarea, $inputText) || $inputText;
          inputText.set(updatedText);
        }
      },
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
    <Separator orientation="vertical" />
    <div class="w-1/2 h-full p-4 overflow-auto hidden-scrollbar">
      <ContextMenu.Root>
        <ContextMenu.Trigger class="h-full">
          {@html preview}
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item on:click={() => {CopyUrlToClipboard($inputText)} }>URLをコピー</ContextMenu.Item>
          <ContextMenu.Item on:click={() => {toast("未実装です。")} }>小説本文をコピー</ContextMenu.Item>
          <ContextMenu.Label>
            ルビを振る
            <ContextMenu.Shortcut>
              <kbd class="kbd-key">Ctrl</kbd><kbd class="kbd-key">i</kbd>
            </ContextMenu.Shortcut>
          </ContextMenu.Label>
          <ContextMenu.Label>
            傍点を振る
            <ContextMenu.Shortcut>
              <kbd class="kbd-key">Ctrl</kbd><kbd class="kbd-key">b</kbd>
            </ContextMenu.Shortcut>
          </ContextMenu.Label>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </div>
  </div>
</main>