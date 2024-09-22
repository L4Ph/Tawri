import { readTextFile } from "@tauri-apps/plugin-fs";

export function readTextFileOnTauri(filePath: string | null) {
	if (filePath && typeof filePath === "string") {
		console.log("選択されたファイルのパス:", filePath);
		const text = readTextFile(filePath);
		console.log("ファイルの内容:", text);
		// inputText.set(text)
	} else {
		console.log("ファイルが選択されませんでした");
	}
}
