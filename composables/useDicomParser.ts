// composables/useDicomParser.ts
import { ref } from 'vue'
import dicomParser from 'dicom-parser'
import type { DicomMetadata } from '~/types/imageTypes'

export const useDicomParser = () => {
  const metadata = ref<DicomMetadata | null>(null)
  const error = ref<Error | null>(null)
  const parseDicomFile = async (file: File) => {
    const reader = new FileReader()
    try {
      const arrayBuffer = await file.arrayBuffer()
      const dicomData = dicomParser.parseDicom(new Uint8Array(arrayBuffer))
      metadata.value = {
        patientName: dicomData.string('x00100010'),
        patientId: dicomData.string('x00100020'),
        studyDate: dicomData.string('x00080020'),
        modality: dicomData.string('x00080060')
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error')
      console.error('Error parsing DICOM file:', e)
    }
  }
  return {
    metadata,
    error,
    parseDicomFile
  }
}