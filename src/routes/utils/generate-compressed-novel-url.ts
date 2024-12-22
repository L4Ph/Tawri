import { page } from "$app/state";
import { compressToEncodedURIComponent } from "./compression";

export async function generateCompressedNovelUrl(
	text: string,
): Promise<string> {
	const compressedText = await compressToEncodedURIComponent(text);
	console.log(compressedText);
	const url = `${page.url.origin}?novel=${compressedText}`;
	console.log(url);
	return url;
}
