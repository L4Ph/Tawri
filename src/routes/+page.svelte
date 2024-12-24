<script lang="ts">
import { Textarea } from "$lib/components/ui/textarea/index.js";
import { parseNarouNovel } from "web-novel-parser";
import { shortcut } from "@svelte-put/shortcut";
import { insertRubyToTextarea } from "./utils/insert-ruby-to-textarea";
import { insertEmphasisToTextarea } from "./utils/insert-emphasis-to-textarea";
import * as Dialog from "$lib/components/ui/dialog/index.js";
import { Button } from "$lib/components/ui/button/index.js";
import { readTextFileOnBrowser } from "./utils/read-text-file-on-browser";
import { FilePen } from "lucide-svelte";
import { FilePlus2 } from "lucide-svelte";
import { Separator } from "$lib/components/ui/separator/index.js";
import { toast } from "svelte-sonner";
import { page } from "$app/state";
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

let urlSearchParams = page.url.searchParams;
if (urlSearchParams) {
	generateSearchParamsToText(urlSearchParams).then((result) => {
		inputText = result;
	});
}

function handleFileChange(event: Event) {
	readTextFileOnBrowser(event, (text: string) => {
		inputText = text;
	});
}

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

  {#if (inputText === "" || !inputText)}
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
<main class="h-svh">
  <div class="flex-grow flex h-full bg-background">
    <div class="w-1/2 p-2 flex flex-col">
        <Textarea class="h-full w-full resize-none" bind:value={inputText} bind:this={textarea} spellcheck="true" />
    </div>
    <Separator orientation="vertical" />
    <div class="w-1/2 h-full p-4 overflow-auto hidden-scrollbar">
      {@html preview}
    </div>
  </div>
</main>