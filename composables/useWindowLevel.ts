import { ref } from 'vue'
import Konva from 'konva'
import type { Ref } from 'vue'

interface WindowLevelReturn {
  windowWidth: Ref<number>
  windowCenter: Ref<number>
  applyWindowLevel: (konvaImage: Konva.Image) => void
}
export const useWindowLevel = (): WindowLevelReturn => {
  const windowWidth = ref<number>(2048)
  const windowCenter = ref<number>(1024)
  const applyWindowLevel = (konvaImage: Konva.Image) => {
    const imageObj = konvaImage.image() as HTMLImageElement
    if (!imageObj) return
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = imageObj.width
    canvas.height = imageObj.height
    ctx.drawImage(imageObj, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    const min = windowCenter.value - windowWidth.value / 2
    const max = windowCenter.value + windowWidth.value / 2
    for (let i = 0; i < pixels.length; i += 4) {
      const value = pixels[i]
      const normalized = ((value - min) / (max - min)) * 255
      pixels[i] = pixels[i + 1] = pixels[i + 2] = normalized
    }
    ctx.putImageData(imageData, 0, 0)
    const newImage = new Image()
    newImage.src = canvas.toDataURL()
    newImage.onload = () => {
      konvaImage.image(newImage)
      konvaImage.getLayer()?.batchDraw()
    }
  }
  return {
    windowWidth,
    windowCenter,
    applyWindowLevel
  }
}