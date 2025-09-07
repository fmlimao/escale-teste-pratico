<script setup lang="ts">
// Props
interface Props {
  type: 'success' | 'info' | 'error';
  message: string | null;
  show: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <div v-if="show && message" :class="`alert-${type}`">
    {{ message }}
  </div>
</template>
