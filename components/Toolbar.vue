<!-- components/Toolbar.vue -->
<template>
    <div class="flex flex-col gap-4 p-4 rounded-lg" :class="{ 'bg-gray-800 text-white': isDarkMode, 'bg-white': !isDarkMode }">
      <div class="flex flex-wrap gap-2">
        <n-button-group>
          <n-button @click="$emit('zoom', 'in')" type="primary">
            Zoom In
          </n-button>
          <n-button @click="$emit('zoom', 'out')" type="primary">
            Zoom Out
          </n-button>
        </n-button-group>  
        <n-button-group>
          <n-button 
            @click="setMeasurementTool('line')"
            :type="activeTool === 'line' ? 'primary' : 'default'"
          >
            Line
          </n-button>
          <n-button 
            @click="setMeasurementTool('circle')"
            :type="activeTool === 'circle' ? 'primary' : 'default'"
          >
            Circle
          </n-button>
          <n-button 
            @click="setMeasurementTool('ellipse')"
            :type="activeTool === 'ellipse' ? 'primary' : 'default'"
          >
            Ellipse
          </n-button>
          <n-button 
            @click="setMeasurementTool('angle')"
            :type="activeTool === 'angle' ? 'primary' : 'default'"
          >
            Angle
          </n-button>
        </n-button-group>  
        <n-button @click="$emit('reset')" type="warning">
          Reset
        </n-button>
        <n-button 
          @click="$emit('crop')" 
          :type="isCropping ? 'success' : 'default'"
        >
          Crop
        </n-button>
      </div>
      <n-collapse>
        <n-collapse-item title="Image Adjustments">
          <div class="image-adjustments">
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">Brightness</label>
              <n-slider
                v-model:value="brightnessValue"
                :min="-100"
                :max="100"
                :step="1"
                @update:value="$emit('brightness-change', $event)"
              />
            </div>
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">Contrast</label>
              <n-slider
                v-model:value="contrastValue"
                :min="-100"
                :max="100"
                :step="1"
                @update:value="$emit('contrast-change', $event)"
              />
            </div>  
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">Window Width</label>
              <n-slider
                v-model:value="windowWidth"
                :min="1"
                :max="4095"
                :step="1"
                @update:value="$emit('window-width-change', $event)"
              />
            </div>  
            <div class="mb-2">
              <label class="block text-sm font-medium mb-1">Window Center</label>
              <n-slider
                v-model:value="windowCenter"
                :min="1"
                :max="4095"
                :step="1"
                @update:value="$emit('window-center-change', $event)"
              />
            </div>
          </div>
        </n-collapse-item>
      </n-collapse>
      <n-collapse>
        <n-collapse-item title="Measurement Settings">
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Unit</label>
            <n-select
              v-model:value="measurementUnit"
              :options="[
                { label: 'Pixels', value: 'px' },
                { label: 'Millimeters', value: 'mm' },
                { label: 'Centimeters', value: 'cm' }
              ]"
              @update:value="$emit('unit-change', $event)"
            />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Pixel Spacing (mm)</label>
            <n-input-number
              v-model:value="pixelSpacing"
              :min="0.001"
              :step="0.001"
              @update:value="$emit('pixel-spacing-change', $event)"
            />
          </div>
        </n-collapse-item>
      </n-collapse>
      <n-button @click="$emit('toggle-theme')" class="mt-2">
        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </n-button>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue'
  import { 
    NButton, 
    NButtonGroup,
    NSlider, 
    NCollapse, 
    NCollapseItem, 
    NSelect, 
    NInputNumber 
  } from 'naive-ui'
  const props = defineProps<{
    isDarkMode: boolean
    isCropping?: boolean
    isMeasuring?: boolean
  }>()
  const activeTool = ref<string | null>(null)
  const brightnessValue = ref(0)
  const contrastValue = ref(0)
  const windowWidth = ref(2048)
  const windowCenter = ref(1024)
  const measurementUnit = ref('px')
  const pixelSpacing = ref(1)
  const setMeasurementTool = (tool: string) => {
    activeTool.value = activeTool.value === tool ? null : tool
    emit('measure', tool)
  }
  const emit = defineEmits<{
    (e: 'zoom', direction: 'in' | 'out'): void
    (e: 'reset'): void
    (e: 'measure', tool: string): void
    (e: 'crop'): void
    (e: 'brightness-change', value: number): void
    (e: 'contrast-change', value: number): void
    (e: 'window-width-change', value: number): void
    (e: 'window-center-change', value: number): void
    (e: 'unit-change', value: string): void
    (e: 'pixel-spacing-change', value: number): void
    (e: 'toggle-theme'): void
  }>()
  </script>





