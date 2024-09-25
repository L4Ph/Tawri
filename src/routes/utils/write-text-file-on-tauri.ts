import { writeTextFile } from "@tauri-apps/plugin-fs";

export async function writeTextFileOnTauri(
	filePath: string,
	inputText: string,
): Promise<boolean> {
	console.log("上書きするファイルのパス:", filePath);
	console.log("上書きするテキスト:", inputText);
	try {
		await writeTextFile(filePath, inputText);
		console.log("ファイルの書き込みに成功しました。");
		return true;
	} catch (error) {
		console.error("ファイルの書き込み中にエラーが発生しました:", error);
		return false;
	}
}
