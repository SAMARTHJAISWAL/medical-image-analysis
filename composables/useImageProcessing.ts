import { ref } from 'vue'
import Konva from 'konva'

export const useImageProcessing = () => {
  const brightness = ref(0)
  const contrast = ref(0)
  const applyFilters = (konvaImage: Konva.Image) => {
    konvaImage.cache()
    konvaImage.filters([
      Konva.Filters.Brighten,
      Konva.Filters.Contrast
    ])
    konvaImage.brightness(brightness.value)
    konvaImage.contrast(contrast.value)
  }
  const adjustBrightness = (value: number, konvaImage: Konva.Image) => {
    brightness.value = value / 100
    applyFilters(konvaImage)
    konvaImage.getLayer()?.batchDraw()
  }
  const adjustContrast = (value: number, konvaImage: Konva.Image) => {
    contrast.value = value / 100
    applyFilters(konvaImage)
    konvaImage.getLayer()?.batchDraw()
  }
  return {
    brightness,
    contrast,
    adjustBrightness,
    adjustContrast
  }
}