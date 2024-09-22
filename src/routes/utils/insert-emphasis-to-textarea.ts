import type { Textarea } from "@/components/ui/textarea";
import { toast } from "svelte-sonner";

export function insertEmphasisToTextarea(
	textarea: Textarea,
	inputText: string,
) {
	toast(`
        "小説家になろう"には、傍点用の記法はありません。
        ルビ記法を使用してください。
        `);
	return null;
}
