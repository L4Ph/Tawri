export function readTextFileOnBrowser(
	event: Event,
	callback: (text: string) => void,
): void {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];

	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			callback(text);
		};
		reader.readAsText(file);
	}
}
