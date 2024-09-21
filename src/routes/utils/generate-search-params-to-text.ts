import { decompressFromEncodedURIComponent } from "lz-string";

export function generateSearchParamsToText(urlSearchParams: URLSearchParams): string | null {
    const compressedText = urlSearchParams.get("novel");
    if (!compressedText) return null; // undefinedの代わりにnullを返す

    const result: string = decompressFromEncodedURIComponent(compressedText);

    return result || null;
}
