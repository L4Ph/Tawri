import { load } from "@tauri-apps/plugin-store";
import { join, resourceDir } from "@tauri-apps/api/path";

export async function loadConfig() {
	//resourceDirを使えば実行パスでストア作成も可能
	const configDir = await join(await resourceDir(), "settings.json");

	//渡されたパスでストアの読み込み設定を確立
	//(ファイルには直接アクセスしないため、config.jsonが無くてもエラーになりません。)
	const store = await load(configDir, { autoSave: false });

	//getでキー値を渡して値を取得する
	//jsonが無いか、キーが存在しない場合はundefinedが返ってくる。
	const data = await store.get<string>("data");
}
