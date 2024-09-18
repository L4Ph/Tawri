export function isTauriApp(): boolean {
    // @ts-ignore
    return typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;
}