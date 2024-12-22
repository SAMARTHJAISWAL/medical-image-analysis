<!-- components/ImageCanvas.vue -->
<template>
    <div>
      <div class="canvas-container" ref="canvasContainer" :class="{ 'dark': isDarkMode }"></div>
      <div v-if="image" class="mt-2 text-sm" :class="{ 'text-gray-200': isDarkMode, 'text-gray-600': !isDarkMode }">
        Image Dimensions: {{ imageSize.width }} x {{ imageSize.height }} pixels
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import Konva from 'konva'
  import { useImageProcessing } from '~/composables/useImageProcessing'
  import { useCrop } from '~/composables/useCrop'
  defineProps<{
    isDarkMode: boolean
  }>()
  const canvasContainer = ref<HTMLDivElement | null>(null)
  const image = ref<HTMLImageElement | null>(null)
  const imageSize = ref({ width: 0, height: 0 })
  let stage: Konva.Stage | null = null
  let layer: Konva.Layer | null = null
  let konvaImage: Konva.Image | null = null
  const scale = ref(1)
  const { adjustBrightness, adjustContrast } = useImageProcessing()
  const { initCrop, applyCrop } = useCrop()
  const measureInRealUnits = (pixels: number, unit: string, pixelSpacing: number) => {
    if (unit === 'px') return `${Math.round(pixels)} px`
    if (unit === 'mm') return `${(pixels * pixelSpacing).toFixed(1)} mm`
    if (unit === 'cm') return `${(pixels * pixelSpacing / 10).toFixed(2)} cm`
    return `${Math.round(pixels)} px`
  }
  const initCanvas = (imageElement: HTMLImageElement) => {
    if (!canvasContainer.value) return
    if (stage) {
      stage.destroy()
    }
    const containerWidth = Math.min(imageElement.width, 800)
    const containerHeight = Math.min(imageElement.height, 600)
    stage = new Konva.Stage({
      container: canvasContainer.value,
      width: containerWidth,
      height: containerHeight,
    })
    layer = new Konva.Layer()
    stage.add(layer)
    konvaImage = new Konva.Image({
      image: imageElement,
      width: containerWidth,
      height: containerHeight,
      draggable: true,
    })
    layer.add(konvaImage)
    layer.draw()
  }
  const setImage = (newImage: HTMLImageElement) => {
    image.value = newImage
    imageSize.value = {
      width: newImage.width,
      height: newImage.height
    }
    initCanvas(newImage)
  }
  const zoom = (direction: 'in' | 'out') => {
    if (!stage) return
    const scaleBy = 1.2
    const oldScale = scale.value
    const pointer = stage.getPointerPosition()
    if (!pointer) return
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }
    const newScale = direction === 'in' ? oldScale * scaleBy : oldScale / scaleBy
    scale.value = newScale 
    stage.scale({ x: newScale, y: newScale })
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }
    stage.position(newPos)
    stage.batchDraw()
  }
  const reset = () => {
    if (!stage || !image.value) return 
    scale.value = 1
    stage.scale({ x: 1, y: 1 })
    stage.position({ x: 0, y: 0 })
    stage.batchDraw()
    if (konvaImage) {
      adjustBrightness(0, konvaImage)
      adjustContrast(0, konvaImage)
    }
  }
  const measure = (unit = 'px', pixelSpacing = 1) => {
    if (!stage || !layer) return
    stage.off('mousedown mousemove mouseup touchstart touchmove touchend')
    let isDrawing = false
    let currentLine: Konva.Line | null = null
    let currentText: Konva.Text | null = null
    stage.on('mousedown touchstart', () => {
      isDrawing = true
      const pos = stage.getPointerPosition()
      if (!pos) return
      currentLine = new Konva.Line({
        points: [pos.x, pos.y, pos.x, pos.y],
        stroke: '#00ff00',
        strokeWidth: 2
      })
      currentText = new Konva.Text({
        x: pos.x,
        y: pos.y - 20,
        text: '0 ' + unit,
        fontSize: 14,
        fill: '#00ff00'
      })
      layer.add(currentLine)
      layer.add(currentText)
      layer.batchDraw()
    })
    stage.on('mousemove touchmove', () => {
      if (!isDrawing || !currentLine || !currentText) return
      const pos = stage.getPointerPosition()
      if (!pos) return
      const points = currentLine.points()
      currentLine.points([points[0], points[1], pos.x, pos.y])
      const dx = pos.x - points[0]
      const dy = pos.y - points[1]
      const distance = Math.sqrt(dx * dx + dy * dy) / scale.value
      currentText.text(measureInRealUnits(distance, unit, pixelSpacing))
      currentText.position({
        x: (points[0] + pos.x) / 2,
        y: (points[1] + pos.y) / 2 - 20
      })
      layer.batchDraw()
    })
    stage.on('mouseup touchend', () => {
      isDrawing = false
      currentLine = null
      currentText = null
    })
  }
  const handleCrop = () => {
    if (!stage || !layer) return 
    const cropBox = initCrop(stage, layer)
    if (konvaImage && cropBox) {
      const newImage = applyCrop(konvaImage)
      if (newImage) {
        setImage(newImage)
      }
    }
  }
  const updateBrightness = (value: number) => {
    if (!konvaImage) return
    adjustBrightness(value, konvaImage)
  }
  const updateContrast = (value: number) => {
    if (!konvaImage) return
    adjustContrast(value, konvaImage)
  }
  onUnmounted(() => {
    if (stage) {
      stage.off('mousedown mousemove mouseup touchstart touchmove touchend')
      stage.destroy()
    }
  })
  defineExpose({
    setImage,
    zoom,
    reset,
    measure,
    updateBrightness,
    updateContrast,
    handleCrop,
    konvaImage
  })
  </script>
  <style scoped>
  .canvas-container {
    border: 1px solid var(--border);
    border-radius: 4px;
    min-height: 400px;
    background-color: var(--card-bg);
  }
  .mt-2 {
    margin-top: 0.5rem;
  }
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .text-gray-200 {
    color: #e5e7eb;
  }
  .text-gray-600 {
    color: #4b5563;
  }
  :deep(.dark) {
    .canvas-container {
      background-color: #2d3748;
      border-color: #4a5568;
    }
  }
  </style>