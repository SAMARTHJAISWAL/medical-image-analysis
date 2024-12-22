<template>
    <div>
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-4">Image Upload</h2>
        <input
          type="file"
          accept="image/*,.dcm"
          @change="handleFileUpload"
          class="hidden"
          ref="fileInput"
        />
        <n-button @click="$refs.fileInput.click()" type="primary">
          Upload Image
        </n-button>
      </div>
    </div>
  </template> 
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'nuxt/app'
  const router = useRouter()
  const fileInput = ref<HTMLInputElement | null>(null)
  const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      router.push('/analyze')
    }
  }
  </script>