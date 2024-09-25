import { writeTextFile } from "@tauri-apps/plugin-fs";

export async function writeTextFileOnTauri(
	filePath: string,
	inputText: string,
) {
	try {
		await writeTextFile(filePath, inputText);
		console.log("ファイルの書き込みに成功しました。");
		return true;
	} catch (error) {
		console.error("ファイルの書き込み中にエラーが発生しました:", error);
		if (error instanceof Error) {
			return {
				success: false,
				error: {
					message: error.message,
					name: error.name,
					stack: error.stack,
				},
			};
		}
		return {
			success: false,
			error: "不明なエラーが発生しました。",
		};
	}
}
