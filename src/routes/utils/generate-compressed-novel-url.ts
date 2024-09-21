import { page } from '$app/stores';
import { compressToEncodedURIComponent } from 'lz-string';
import { toast } from 'svelte-sonner';
import { get } from 'svelte/store';

export function generateCompressedNovelUrl(text: string): string {
  const compressedText = compressToEncodedURIComponent(text);
  return `${get(page).url.origin}?novel=${compressedText}`;
}