const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const createUpstream = (value: unknown) => {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(value);
			controller.close();
		},
	});
};

export async function compressToBase64(input: string): Promise<string> {
	const upstream = createUpstream(textEncoder.encode(input));
	const compression = new CompressionStream("deflate");
	const stream = upstream.pipeThrough(compression);
	const compressed = await new Response(stream).arrayBuffer();
	return btoa(
		new Uint8Array(compressed).reduce(
			(acc, c) => acc + String.fromCharCode(c),
			"",
		),
	);
}

export async function decompressFromBase64(input: string): Promise<string> {
	const compressedBytes = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
	const upstream = createUpstream(compressedBytes);
	const decompression = new DecompressionStream("deflate");
	const stream = upstream.pipeThrough(decompression);
	const decompressed = await new Response(stream).arrayBuffer();
	return textDecoder.decode(decompressed);
}

export async function compressToEncodedURIComponent(
	input: string,
): Promise<string> {
	const withBase64 = await compressToBase64(input);
	return withBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function decompressFromEncodedURIComponent(
	input: string,
): Promise<string> {
	let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
	while (base64.length % 4) {
		base64 += "=";
	}
	return decompressFromBase64(base64);
}
