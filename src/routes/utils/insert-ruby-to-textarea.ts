import { isTauriApp } from "./is-tauri-app";
import type { Textarea } from "@/components/ui/textarea";

export function insertRubyToTextarea(textarea: Textarea, inputText: string): string | null {
  if (isTauriApp()) {
    return null;
  }
  const { selectionStart, selectionEnd } = textarea;
  return inputText.slice(0, selectionStart) + '|《》' + inputText.slice(selectionEnd);
}
