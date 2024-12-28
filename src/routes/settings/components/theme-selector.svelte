<script lang="ts">
import * as Select from "../../../lib/components/ui/select/index";
import { Label } from "../../../lib/components/ui/label/index";
import { setMode } from "mode-watcher";
import { join, resourceDir } from "@tauri-apps/api/path";
import { load } from "@tauri-apps/plugin-store";

const themes: { value: "light" | "dark" | "system"; label: string }[] = [
	{ value: "light", label: "ライト" },
	{ value: "dark", label: "ダーク" },
	{ value: "system", label: "システムに従う" },
];

let value: "light" | "dark" | "system" = $state("system");

const triggerContent = $derived(
	themes.find((t) => t.value === value)?.label ?? "テーマを選択",
);

async function saveTheme() {
	const configDir = await join(await resourceDir(), "config.json");
	const store = await load(configDir, { autoSave: false });
	await store.set("app-theme", value);
	await store.save();
	console.log(configDir);
}

$effect(() => {
	saveTheme();
});
</script>
  
  <div class="flex items-center space-x-4">
    <Label for="terms">アプリのテーマ</Label>
    <Select.Root type="single" name="favoriteFruit" bind:value>
      <Select.Trigger class="w-[180px]">
        {triggerContent}
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {#each themes as theme}
            <Select.Item value={theme.value} label={theme.label} onclick={() => setMode(theme.value)}>
              {theme.label}
            </Select.Item>
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  </div>