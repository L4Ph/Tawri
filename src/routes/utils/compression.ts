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

export async function compressToUTF16(input: string): Promise<string> {
	const upstream = createUpstream(textEncoder.encode(input));
	const compression = new CompressionStream("deflate");
	const stream = upstream.pipeThrough(compression);
	const compressed = await new Response(stream).arrayBuffer();

	let compressedBytes = new Uint8Array(compressed);

	if (compressedBytes.length % 2 !== 0) {
		const paddedBytes = new Uint8Array(compressedBytes.length + 1);
		paddedBytes.set(compressedBytes);
		paddedBytes[compressedBytes.length] = 0; // 奇数個配列の場合、最後のバイトに 0 をパディング
		compressedBytes = paddedBytes;
	}

	const compressedUint16Array = new Uint16Array(compressedBytes.buffer);
	return String.fromCharCode(...compressedUint16Array);
}

export async function decompressFromUTF16(input: string): Promise<string> {
	const compressedUint16Array = new Uint16Array(
		input.split("").map((c) => c.charCodeAt(0)),
	);
	let compressedBytes = new Uint8Array(compressedUint16Array.buffer);

	if (compressedBytes[compressedBytes.length - 1] === 0) {
		compressedBytes = compressedBytes.slice(0, compressedBytes.length - 1); // パディングされた 0 を削除
	}

	const upstream = createUpstream(compressedBytes);
	const decompression = new DecompressionStream("deflate");
	const stream = upstream.pipeThrough(decompression);
	const decompressed = await new Response(stream).arrayBuffer();
	return textDecoder.decode(decompressed);
}

export async function compressToUint8Array(input: string): Promise<Uint8Array> {
	const upstream = createUpstream(textEncoder.encode(input));
	const compression = new CompressionStream("deflate");
	const stream = upstream.pipeThrough(compression);
	const compressed = await new Response(stream).arrayBuffer();
	return new Uint8Array(compressed);
}

export async function decompressFromUint8Array(
	input: Uint8Array,
): Promise<string> {
	const upstream = createUpstream(input);
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
