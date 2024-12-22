<!-- pages/analyze.vue -->
<template>
  <div class="min-h-screen" :class="{ 'dark': isDarkMode }">
          <div class="max-w-6xl mx-auto p-4">
                  <Toolbar 
                        @zoom="handleZoom"
            @reset="handleReset"
            @measure="handleMeasure"
            @crop="handleCrop"
            @brightness-change="handleBrightnessChange"
            @contrast-change="handleContrastChange"
            @window-width-change="(v) => handleWindowChange('width', v)"
            @window-center-change="(v) => handleWindowChange('center', v)"
            @unit-change="handleUnitChange"
            @pixel-spacing-change="handlePixelSpacingChange"
            @toggle-theme="toggleDarkMode"
            :isCropping="isCropping"
            :isMeasuring="isMeasuring"
            :isDarkMode="isDarkMode"
          />
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="upload-section dark:bg-gray-800 dark:border-gray-700" v-if="!hasImage">
                <input
                  type="file"
                  accept="image/*,.dcm"
                  @change="handleFileUpload"
                  class="hidden"
                  ref="fileInput"
                />
                <n-button @click="$refs.fileInput?.click()" type="primary" size="large">
                  Upload Image
                </n-button>
              </div>
              <ImageCanvas ref="imageCanvasRef" :isDarkMode="isDarkMode" />
              <DicomViewer ref="dicomViewer" v-if="isDicomFile" :isDarkMode="isDarkMode" />
            </div>
          </div>
          </div>
</template>
<script setup lang="ts">
import { ref, inject } from 'vue'
import { NButton } from 'naive-ui'
import Toolbar from '~/components/Toolbar.vue'
import ImageCanvas from '~/components/ImageCanvas.vue'
import DicomViewer from '~/components/DicomViewer.vue'
import { useWindowLevel } from '~/composables/useWindowLevel'
const imageCanvasRef = ref<InstanceType<typeof ImageCanvas> | null>(null)
const dicomViewer = ref<InstanceType<typeof DicomViewer> | null>(null)
const isDicomFile = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const hasImage = ref(false)
const isMeasuring = ref(false)
const isCropping = ref(false)
const isDarkMode = inject('isDarkMode', ref(false))
const currentUnit = ref('px')
const pixelSpacing = ref(1)
const { windowWidth, windowCenter, applyWindowLevel } = useWindowLevel()
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
      isDicomFile.value = file.name.toLowerCase().endsWith('.dcm')
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        if (imageCanvasRef.value) {
          imageCanvasRef.value.setImage(img)
          hasImage.value = true
                  }
        if (isDicomFile.value && dicomViewer.value) {
          dicomViewer.value.loadDicomFile(file)
        }
              }
    }
    reader.readAsDataURL(file)
  }
const handleZoom = (direction: 'in' | 'out') => {
  if (imageCanvasRef.value) {
    imageCanvasRef.value.zoom(direction)
  }
}
const handleReset = () => {
  if (imageCanvasRef.value) {
    imageCanvasRef.value.reset()
  }
}
const handleMeasure = () => {
  if (!imageCanvasRef.value) return 
  isMeasuring.value = !isMeasuring.value
  if (isMeasuring.value) {
    imageCanvasRef.value.measure(currentUnit.value, pixelSpacing.value)
  }
}
const handleCrop = () => {
  if (imageCanvasRef.value) {
    isCropping.value = !isCropping.value
    imageCanvasRef.value.handleCrop()
  }
}
const handleBrightnessChange = (value: number) => {
  if (imageCanvasRef.value) {
    imageCanvasRef.value.updateBrightness(value)
  }
}
const handleContrastChange = (value: number) => {
  if (imageCanvasRef.value) {
    imageCanvasRef.value.updateContrast(value)
  }
}
const handleWindowChange = (type: 'width' | 'center', value: number) => {
  if (!imageCanvasRef.value?.konvaImage) return 
  if (type === 'width') {
    windowWidth.value = value
  } else {
    windowCenter.value = value
  }
  applyWindowLevel(imageCanvasRef.value.konvaImage)
}
const handleUnitChange = (unit: string) => {
  currentUnit.value = unit
  if (isMeasuring.value && imageCanvasRef.value) {
    imageCanvasRef.value.measure(unit, pixelSpacing.value)
  }
}
const handlePixelSpacingChange = (spacing: number) => {
  pixelSpacing.value = spacing
  if (isMeasuring.value && imageCanvasRef.value) {
    imageCanvasRef.value.measure(currentUnit.value, spacing)
  }
}
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
}
</script>
<style>
.dark {
    background-color: var(--background);
    color: var(--text);
  }
.upload-section {
  @apply flex justify-center items-center min-h-[400px] border-2 border-dashed rounded-lg p-5;
  background-color: var(--card-bg);
  border-color: var(--border);
}
:root {
  --background: #ffffff;
  --text: #000000;
  --card-bg: #ffffff;
  --border: #e2e8f0;
}
:root.dark {
  --background: #1a1a1a;
  --text: #ffffff;
  --card-bg: #2d3748;
  --border: #4a5568;
}
  .grid {
    display: grid;
  } 
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  @media (min-width: 768px) {
    .md\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  .gap-4 {
    gap: 1rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .max-w-6xl {
    max-width: 72rem;
  }
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
  .p-4 {
    padding: 1rem;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .hidden {
    display: none;
  }
</style>