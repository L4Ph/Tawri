import { decompressFromEncodedURIComponent } from "./compression";

export async function generateSearchParamsToText(
	urlSearchParams: URLSearchParams,
): Promise<string> {
	const compressedText = urlSearchParams.get("novel");
	if (!compressedText) {
		return "";
	}

	const result = decompressFromEncodedURIComponent(compressedText);
	return result ?? ""; // resultがnullの場合は空文字を返す
}
