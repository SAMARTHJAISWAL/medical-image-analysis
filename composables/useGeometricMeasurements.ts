import { ref } from 'vue'
import Konva from 'konva'

export type GeometricShape = 'circle' | 'ellipse' | 'angle' | 'roi' | 'line'

export const useGeometricMeasurements = () => {
  const activeShape = ref<GeometricShape | null>(null)
  let isDrawing = false
  let startPoint = { x: 0, y: 0 }
  const drawCircle = (stage: Konva.Stage, layer: Konva.Layer) => {
    let circle: Konva.Circle | null = null
    let text: Konva.Text | null = null
    stage.on('mousedown touchstart', () => {
      isDrawing = true
      const pos = stage.getPointerPosition()
      if (!pos) return
      startPoint = pos
      circle = new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: 0,
        stroke: '#00ff00',
        strokeWidth: 2,
        dashEnabled: true,
        dash: [5, 5]
      })
      text = new Konva.Text({
        x: pos.x,
        y: pos.y - 20,
        text: '0 px',
        fontSize: 14,
        fill: '#00ff00'
      })
      layer.add(circle)
      layer.add(text)
      layer.batchDraw()
    })
    stage.on('mousemove touchmove', () => {
      if (!isDrawing || !circle || !text) return
      const pos = stage.getPointerPosition()
      if (!pos) return
      const dx = pos.x - startPoint.x
      const dy = pos.y - startPoint.y
      const radius = Math.sqrt(dx * dx + dy * dy)
      circle.radius(radius)
      const circumference = 2 * Math.PI * radius
      const area = Math.PI * radius * radius
      text.text(
        `Radius: ${Math.round(radius)} px\n` +
        `Circumference: ${Math.round(circumference)} px\n` +
        `Area: ${Math.round(area)} px²`
      )
      text.position({
        x: startPoint.x - text.width() / 2,
        y: startPoint.y - radius - 40
      })
      layer.batchDraw()
    })
    stage.on('mouseup touchend', () => {
      isDrawing = false
    })
  }
  const drawEllipse = (stage: Konva.Stage, layer: Konva.Layer) => {
    let ellipse: Konva.Ellipse | null = null
    let text: Konva.Text | null = null
    stage.on('mousedown touchstart', () => {
      isDrawing = true
      const pos = stage.getPointerPosition()
      if (!pos) return
      startPoint = pos
      ellipse = new Konva.Ellipse({
        x: pos.x,
        y: pos.y,
        radiusX: 0,
        radiusY: 0,
        stroke: '#00ff00',
        strokeWidth: 2,
        dashEnabled: true,
        dash: [5, 5]
      })
      text = new Konva.Text({
        x: pos.x,
        y: pos.y - 20,
        text: '0 px',
        fontSize: 14,
        fill: '#00ff00'
      })
      layer.add(ellipse)
      layer.add(text)
      layer.batchDraw()
    })
    stage.on('mousemove touchmove', () => {
      if (!isDrawing || !ellipse || !text) return
      const pos = stage.getPointerPosition()
      if (!pos) return
      const radiusX = Math.abs(pos.x - startPoint.x)
      const radiusY = Math.abs(pos.y - startPoint.y)
      ellipse.radiusX(radiusX)
      ellipse.radiusY(radiusY)
      const h = Math.pow((radiusX - radiusY) / (radiusX + radiusY), 2)
      const circumference = Math.PI * (radiusX + radiusY) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
      const area = Math.PI * radiusX * radiusY
      text.text(
        `RadiusX: ${Math.round(radiusX)} px\n` +
        `RadiusY: ${Math.round(radiusY)} px\n` +
        `Circumference: ${Math.round(circumference)} px\n` +
        `Area: ${Math.round(area)} px²`
      )
      text.position({
        x: startPoint.x - text.width() / 2,
        y: startPoint.y - radiusY - 60
      })
      layer.batchDraw()
    })
    stage.on('mouseup touchend', () => {
      isDrawing = false
    })
  }
  const drawAngle = (stage: Konva.Stage, layer: Konva.Layer) => {
    let line1: Konva.Line | null = null
    let line2: Konva.Line | null = null
    let text: Konva.Text | null = null
    let points: number[] = []
    stage.on('mousedown touchstart', () => {
      const pos = stage.getPointerPosition()
      if (!pos) return
      if (points.length === 0) {
        points = [pos.x, pos.y]
        line1 = new Konva.Line({
          points: [pos.x, pos.y, pos.x, pos.y],
          stroke: '#00ff00',
          strokeWidth: 2
        })
        layer.add(line1)
      } else if (points.length === 2) {
        line2 = new Konva.Line({
          points: [pos.x, pos.y, pos.x, pos.y],
          stroke: '#00ff00',
          strokeWidth: 2
        })
        text = new Konva.Text({
          x: pos.x,
          y: pos.y,
          text: '0°',
          fontSize: 14,
          fill: '#00ff00'
        })
        layer.add(line2)
        layer.add(text)
      }
      layer.batchDraw()
    })
    stage.on('mousemove touchmove', () => {
      const pos = stage.getPointerPosition()
      if (!pos) return
      if (line1 && points.length === 2) {
        line1.points([points[0], points[1], pos.x, pos.y])
      } else if (line2 && text && points.length === 4) {
        line2.points([points[2], points[3], pos.x, pos.y])  
        const angle1 = Math.atan2(points[1] - points[3], points[0] - points[2])
        const angle2 = Math.atan2(pos.y - points[3], pos.x - points[2])
        let angle = Math.abs((angle2 - angle1) * 180 / Math.PI)
        if (angle > 180) angle = 360 - angle
        text.text(`${Math.round(angle)}°`)
        text.position({
          x: points[2] + 10,
          y: points[3] - 20
        })
      }
      layer.batchDraw()
    })
    stage.on('mouseup touchend', () => {
      const pos = stage.getPointerPosition()
      if (!pos) return

      if (points.length === 0) {
        points = [pos.x, pos.y]
      } else if (points.length === 2) {
        points = [...points, pos.x, pos.y]
      } else {
        points = []
        if (line1) line1.destroy()
        if (line2) line2.destroy()
        if (text) text.destroy()
        line1 = null
        line2 = null
        text = null
      }
    })
  }
  return {
    activeShape,
    drawCircle,
    drawEllipse,
    drawAngle
  }
}