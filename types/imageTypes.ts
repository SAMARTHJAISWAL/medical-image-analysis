export interface ImageMetadata {
    width: number
    height: number
    format?: string
    size?: number
  }
  export interface DicomMetadata {
    patientName?: string
    patientId?: string
    studyDate?: string
    modality?: string
    [key: string]: string | undefined
  }
  export interface ImageProcessingOptions {
    brightness: number
    contrast: number
    zoom: number
  }