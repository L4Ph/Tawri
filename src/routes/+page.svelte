<script lang="ts">
import Textarea from "$lib/components/ui/textarea/textarea.svelte";
import { parseNarouNovel } from "@l4ph/web-novel-parser";
import { shortcut } from "@svelte-put/shortcut";
import { insertRubyToTextarea } from "./utils/insert-ruby-to-textarea";
import { insertEmphasisToTextarea } from "./utils/insert-emphasis-to-textarea";
import * as Dialog from "$lib/components/ui/dialog";
import Button from "@/components/ui/button/button.svelte";
import { writable } from "svelte/store";
import CodeMirror from "svelte-codemirror-editor";
import ScrollArea from "@/components/ui/scroll-area/scroll-area.svelte";
import { readTextFileOnBrowser } from "./utils/read-text-file-on-browser";
import { FilePen } from "lucide-svelte";
import { FilePlus2 } from "lucide-svelte";
import { Separator } from "@/components/ui/separator";
import { generateCompressedNovelUrl } from "./utils/generate-compressed-novel-url";
import { toast } from "svelte-sonner";
import * as ContextMenu from "$lib/components/ui/context-menu";
import { page } from "$app/stores";
import { generateSearchParamsToText } from "./utils/generate-search-params-to-text";
import { isTauriApp } from "./utils/is-tauri-app";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { listen } from "@tauri-apps/api/event";
import { readTextFileOnTauri } from "./utils/read-text-file-on-tauri";
import { writeTextFileOnTauri } from "./utils/write-text-file-on-tauri";

let inputText = $state("");
let textarea: Textarea;
let open = $state(true);
let fileInput = $state<HTMLInputElement | null>(null);
let textFilePath = $state<string>("");
let preview = $derived.by(() => {
	const parsedHtml = parseNarouNovel(inputText);
	return parsedHtml;
});

let urlSearchParams = $page.url.searchParams;
if (urlSearchParams) {
	const result = generateSearchParamsToText(urlSearchParams);
	if (result) {
		inputText = result;
	}
}

function handleFileChange(event: Event) {
	readTextFileOnBrowser(event, (text: string) => {
		inputText = text;
	});
}

function CopyUrlToClipboard(inputText: string) {
	const url = generateCompressedNovelUrl(inputText);
	navigator.clipboard.writeText(url);
}

if (isTauriApp()) {
	listen("open_file", async () => {
		try {
			const filePath = await openDialog({
				multiple: false,
				directory: false,
				filters: [
					{
						name: "",
						extensions: ["txt"],
					},
				],
			});
			if (filePath) {
				textFilePath = filePath;
			}
			const text = await readTextFileOnTauri(filePath);
			if (text !== undefined) {
				inputText = text;
				toast.success("ファイルを正常に読み込みました。");
			}
		} catch (error) {
			console.error("エラーが発生しました:", error);
		}
	});

	listen("save_file", async () => {
		try {
			writeTextFileOnTauri(textFilePath, inputText);
			toast.success("ファイルが正常に保存されました。");
		} catch (error) {
			console.error("ファイル保存中にエラーが発生しました:", error);
			toast.error("ファイルの保存に失敗しました。");
		}
	});

	listen("save_as", async () => {
		try {
			toast.info(`"名前を付けて保存"機能は現在開発中です。`);
		} catch (error) {
			console.error("ファイル保存中にエラーが発生しました:", error);
			toast.error("ファイルの保存に失敗しました。");
		}
	});
}
</script>

<svelte:window
  use:shortcut={{
    trigger: [
      { 
        key: 'i', 
        modifier: 'ctrl', 
        callback: () => {
          const updatedText = insertRubyToTextarea(textarea, inputText) || inputText;
          inputText = updatedText;
        }
      },
      { 
        key: 'b', 
        modifier: 'ctrl', 
        callback: () => {
          const updatedText = insertEmphasisToTextarea(textarea, inputText) || inputText;
          inputText = updatedText;
        }
      },
    ],
  }}
/>

<main class="h-screen">
  {#if (inputText === "" || !inputText) && !isTauriApp() }
    <Dialog.Root bind:open>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>"書く"にフォーカスする。</Dialog.Title>
          <Dialog.Description>
            <p>Tawriは、軽量な小説向けのエディタです。</p>
            <p><kbd class="kbd-key">Ctrl</kbd> + <kbd class="kbd-key">i</kbd>でルビ / <kbd class="kbd-key">Ctrl</kbd> + <kbd class="kbd-key">b</kbd>で傍点が入力できます。</p>
          </Dialog.Description>
        </Dialog.Header>
        <Button onclick={() => open = false}><FilePlus2 class="mr-2" />新しく書く</Button>
        <Button onclick={() => fileInput?.click()}>
          <FilePen class="mr-2" />
          ファイルを開く
          <input type="file" accept=".txt" class="hidden" bind:this={fileInput} onchange={handleFileChange} />
        </Button>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
  <div class="flex h-full bg-background">
    <div class="w-1/2 p-4 flex flex-col">
      <ScrollArea>
        <CodeMirror
          bind:value={inputText} 
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
          {#if !isTauriApp()}
            <ContextMenu.Item onclick={() => {CopyUrlToClipboard(inputText)} }>URLをコピー</ContextMenu.Item>
          {/if}
          <ContextMenu.Item onclick={() => {
            // TODO: 小説本文のコピー機能を実装する
            toast.info(`"小説本文をコピー"機能は現在開発中です。`);
            } }>小説本文をコピー</ContextMenu.Item>
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