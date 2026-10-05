<script lang="ts">
  import { onMount as mounted } from 'svelte';

  let count = $state(0);
  const doubled = $derived(count * 2);
  mounted(() => { console.log('Counter mounted'); });
</script>

{#if count >= 0}
  <button onclick={() => count++}>Count: {count}; double: {doubled}</button>
{/if}

<!-- if throw return { are plain comment text -->
<style>
  button { color: #246b45; }
</style>
