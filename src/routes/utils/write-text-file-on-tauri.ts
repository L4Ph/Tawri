import { writeTextFile } from "@tauri-apps/plugin-fs";

export function writeTextFileOnTauri(
	filePath: string | null,
	_inputText: string,
) {
	console.log("上書きするファイルのパス:", filePath);
	console.log("上書きするテキスト:", _inputText);
	// writeTextFile(filePath, inputText);
}
