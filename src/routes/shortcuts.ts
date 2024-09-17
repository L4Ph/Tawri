import { toast } from "svelte-sonner";
import { isTauriApp } from "$lib/is-tauri-app";
import type { Textarea } from "@/components/ui/textarea";

export function insertRubyToTextarea(textarea: Textarea, inputText: string) {
  if (isTauriApp()) {
    return null;
  }
  const { selectionStart, selectionEnd } = textarea;
  inputText = inputText.slice(0, selectionStart) + '|《》' + inputText.slice(selectionEnd);
}

export function insertEmphasisToTextarea() {
  toast("未実装です。");
}
