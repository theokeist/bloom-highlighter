<script setup lang="ts">
import { computed, ref as signal } from 'vue';

const props = defineProps<{ initial?: number }>();
const count = signal(props.initial ?? 0);
const doubled = computed(() => count.value * 2);
</script>

<template>
  <CounterButton v-if="count >= 0" @click="count++">
    Count: {{ count }}; double: {{ doubled }}
  </CounterButton>
  <!-- if throw return { are plain comment text -->
</template>

<style scoped>
.counter { color: #246b45; }
</style>
