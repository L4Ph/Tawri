import { readTextFile } from "@tauri-apps/plugin-fs";

export async function readTextFileOnTauri(
	filePath: string | null,
): Promise<string | undefined> {
	if (!filePath || typeof filePath !== "string") {
		console.log("ファイルが選択されませんでした");
		return undefined;
	}

	try {
		const text = await readTextFile(filePath);

		if (text !== undefined) {
			return text;
		}
		console.log("テキストが空または取得できませんでした");
		return undefined;
	} catch (error) {
		console.error(`ファイル '${filePath}' の読み込み中にエラーが発生しました:`, error);
		return undefined;
	}
	}
}
