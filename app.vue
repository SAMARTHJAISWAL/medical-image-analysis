<!-- app.vue -->
<template>
  <div :class="{ 'dark': isDarkMode }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const isDarkMode = ref(false)
provide('isDarkMode', isDarkMode)
</script>