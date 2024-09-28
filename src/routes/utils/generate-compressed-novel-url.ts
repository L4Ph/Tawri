import { page } from "$app/stores";
import { compressToEncodedURIComponent } from "./compression";
import { get } from "svelte/store";

export async function generateCompressedNovelUrl(
	text: string,
): Promise<string> {
	const compressedText = await compressToEncodedURIComponent(text);
	console.log(compressedText);
	const url = `${get(page).url.origin}?novel=${compressedText}`;
	console.log(url);
	return url;
}
