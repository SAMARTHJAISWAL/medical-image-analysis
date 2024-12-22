<!-- components/DicomViewer.vue -->
<template>
    <div class="dicom-viewer p-4 rounded-lg" :class="{ 'bg-gray-800 text-white': isDarkMode, 'bg-white': !isDarkMode }">
      <div v-if="metadata" class="metadata-grid">
        <div class="metadata-item" v-for="(value, key) in metadata" :key="key">
          <span class="label">{{ formatLabel(key) }}:</span>
          <span class="value">{{ value }}</span>
        </div>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="!metadata && !error" class="loading">
        Loading DICOM data...
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue'
  import dicomParser from 'dicom-parser'
  interface DicomMetadata {
    patientName: string
    patientId: string
    studyDate: string
    modality: string
    studyDescription: string
    seriesDescription: string
    manufacturer: string
    pixelSpacing: string
    windowCenter: string
    windowWidth: string
    [key: string]: string
  }
  defineProps<{
    isDarkMode: boolean
  }>()
  const metadata = ref<DicomMetadata | null>(null)
  const error = ref<string | null>(null)
  const formatDate = (dateString: string): string => {
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`
  }
  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
  }
  const loadDicomFile = async (file: File) => {
    const reader = new FileReader() 
    try {
      const arrayBuffer = await file.arrayBuffer()
      const dicomData = dicomParser.parseDicom(new Uint8Array(arrayBuffer))
      metadata.value = {
        patientName: dicomData.string('x00100010') || 'N/A',
        patientId: dicomData.string('x00100020') || 'N/A',
        studyDate: formatDate(dicomData.string('x00080020') || ''),
        modality: dicomData.string('x00080060') || 'N/A',
        studyDescription: dicomData.string('x00081030') || 'N/A',
        seriesDescription: dicomData.string('x0008103E') || 'N/A',
        manufacturer: dicomData.string('x00080070') || 'N/A',
        pixelSpacing: dicomData.string('x00280030') || 'N/A',
        windowCenter: dicomData.string('x00281050') || 'N/A',
        windowWidth: dicomData.string('x00281051') || 'N/A'
      }
      error.value = null
    } catch (e) {
      error.value = `Error parsing DICOM file: ${e instanceof Error ? e.message : 'Unknown error'}`
      metadata.value = null
      console.error('Error parsing DICOM file:', e)
    }
  }
  defineExpose({
    loadDicomFile
  })
  </script>
  <style scoped>
  .dicom-viewer {
    height: 100%;
    min-height: 400px;
  }
  .metadata-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  .metadata-item {
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    background-color: var(--card-bg);
  }
  .label {
    display: block;
    font-weight: 500;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    color: var(--text);
  }
  .value {
    font-size: 0.875rem;
    color: var(--text);
  }
  .error-message {
    padding: 1rem;
    border-radius: 0.375rem;
    background-color: rgb(254, 226, 226);
    color: rgb(185, 28, 28);
    margin: 1rem 0;
  }
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 0.875rem;
    color: var(--text);
  }
  :deep(.dark) {
    .metadata-item {
      border-color: #4a5568;
      background-color: #2d3748;
    }
    .error-message {
      background-color: rgb(127, 29, 29);
      color: rgb(254, 226, 226);
    }
  }
  </style>