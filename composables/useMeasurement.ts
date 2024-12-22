import { ref } from 'vue'
import type { Ref } from 'vue'

export type MeasurementUnit = 'px' | 'mm' | 'cm'

interface MeasurementReturn {
  pixelSpacing: Ref<number>
  currentUnit: Ref<MeasurementUnit>
  convertToRealWorld: (pixels: number) => number
  formatMeasurement: (pixels: number) => string
}
export const useMeasurement = (): MeasurementReturn => {
  const pixelSpacing = ref<number>(1) // mm/pixel
  const currentUnit = ref<MeasurementUnit>('px')
  const convertToRealWorld = (pixels: number): number => {
    switch (currentUnit.value) {
      case 'mm':
        return pixels * pixelSpacing.value
      case 'cm':
        return (pixels * pixelSpacing.value) / 10
      default:
        return pixels
    }
  }
  const formatMeasurement = (pixels: number): string => {
    const value = convertToRealWorld(pixels)
    switch (currentUnit.value) {
      case 'mm':
        return `${value.toFixed(1)} mm`
      case 'cm':
        return `${value.toFixed(2)} cm`
      default:
        return `${Math.round(value)} px`
    }
  }
  return {
    pixelSpacing,
    currentUnit,
    convertToRealWorld,
    formatMeasurement
  }
}