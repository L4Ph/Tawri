import { isTauriApp } from "./is-tauri-app";
import type { Textarea } from "@/components/ui/textarea";

export function insertRubyToTextarea(
	textarea: Textarea,
	inputText: string,
): string | null {
	if (isTauriApp()) {
		return null;
	}
	const selectionStart: number =
		(textarea as unknown as HTMLTextAreaElement).selectionStart ?? undefined;
	const selectionEnd: number =
		(textarea as unknown as HTMLTextAreaElement).selectionEnd ?? undefined;

	if (selectionStart === undefined || selectionEnd === undefined) {
		return null;
	}

	return `${inputText.slice(0, selectionStart)}|《》${inputText.slice(selectionEnd)}`;
}
