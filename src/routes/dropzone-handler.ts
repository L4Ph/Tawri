import type { Textarea } from "@/components/ui/textarea";
import { toast } from "svelte-sonner";

export let files = {
  accepted: [],
  rejected: []
};

export function handleFileSelect(e: any, inputText: string, textarea: Textarea) {
  const { acceptedFiles, fileRejections } = e.detail;


    // @ts-ignore
    files.accepted = [...files.accepted, ...acceptedFiles];
    // @ts-ignore
    files.rejected = [...files.rejected, ...fileRejections];

    if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = () => {
            inputText = reader.result as string;
            textarea.focus();
        };
        reader.readAsText(file);
        } else {
        toast("テキストファイルのみ対応しています。");
        }
    }
}
