import { ref } from 'vue'
import Konva from 'konva'

export const useCrop = () => {
  let cropBox: Konva.Rect | null = null
  let startPoint = { x: 0, y: 0 }
  const initCrop = (stage: Konva.Stage, layer: Konva.Layer) => {
    let isDrawing = false
    stage.on('mousedown touchstart', (e) => {
      isDrawing = true
      const pos = stage.getPointerPosition()
      if (!pos) return 
      startPoint = pos  
      if (cropBox) {
        cropBox.destroy()
      }  
      cropBox = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: '#00ff00',
        strokeWidth: 2,
        dash: [5, 5]
      })  
      layer.add(cropBox)
      layer.batchDraw()
    })
    stage.on('mousemove touchmove', () => {
      if (!isDrawing || !cropBox) return
      const pos = stage.getPointerPosition()
      if (!pos) return 
      const width = pos.x - startPoint.x
      const height = pos.y - startPoint.y  
      cropBox.width(width)
      cropBox.height(height)
      layer.batchDraw()
    })
    
    stage.on('mouseup touchend', () => {
      isDrawing = false
    })
  }
  const applyCrop = (konvaImage: Konva.Image) => {
    if (!cropBox) return
    const imageObj = konvaImage.image()
    if (!imageObj) return
    const scale = konvaImage.getAbsoluteScale()
    const box = cropBox.getClientRect()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = box.width
    canvas.height = box.height
    ctx.drawImage(
      imageObj,
      box.x / scale.x,
      box.y / scale.y,
      box.width / scale.x,
      box.height / scale.y,
      0,
      0,
      box.width,
      box.height
    )
    const newImage = new Image()
    newImage.src = canvas.toDataURL()
    return newImage
  }
  return {
    initCrop,
    applyCrop,
    getCropBox: () => cropBox
  }
}