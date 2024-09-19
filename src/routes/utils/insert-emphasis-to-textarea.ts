import { toast } from "svelte-sonner";

export function insertEmphasisToTextarea() {
    toast(`
        "小説家になろう"には、傍点用の記法はありません。
        ルビ記法を使用してください。
        `)
}