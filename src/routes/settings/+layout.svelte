<script lang="ts">
let { children } = $props();
</script>
<div class="h-svh">
    <div class="flex-grow flex h-full justify-center">
        {@render children?.()}
    </div>
</div>