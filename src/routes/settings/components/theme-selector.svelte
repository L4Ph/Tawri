<script lang="ts">
import * as Select from "../../../lib/components/ui/select/index";
import { Label } from "../../../lib/components/ui/label/index";
import { setMode } from "mode-watcher";

const themes: { value: "light" | "dark" | "system"; label: string }[] = [
	{ value: "light", label: "ライト" },
	{ value: "dark", label: "ダーク" },
	{ value: "system", label: "システム" },
];

let value: "light" | "dark" | "system" = $state("system");

const triggerContent = $derived(
	themes.find((t) => t.value === value)?.label ?? "テーマを選択",
);
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