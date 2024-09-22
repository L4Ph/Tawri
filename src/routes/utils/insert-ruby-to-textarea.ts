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
		(textarea as HTMLTextAreaElement).selectionStart ?? undefined;
	const selectionEnd: number =
		(textarea as HTMLTextAreaElement).selectionEnd ?? undefined;

	if (selectionStart === undefined || selectionEnd === undefined) {
		return null; // 何かしらの対応をここで追加
	}

	return (
		inputText.slice(0, selectionStart) + "|《》" + inputText.slice(selectionEnd)
	);
}
