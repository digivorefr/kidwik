import { useState, useCallback } from 'react'
import { processImage, validateImage, IMAGE_PRESETS } from '../utils/image-processing'

interface ImageUploadOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  preset?: keyof typeof IMAGE_PRESETS
  onSuccess?: (dataUrl: string) => void
  onError?: (error: string) => void
}

interface ImageUploadResult {
  image: string | null
  isUploading: boolean
  error: string | null
  upload: (file: File) => Promise<string | null>
  reset: () => void
  stats: {
    originalSize: number
    compressedSize: number
    compressionRatio: number
    width: number
    height: number
  } | null
}

/**
 * Hook for handling image uploads with validation and compression
 * @param options Configuration options for the image upload
 * @returns Image upload state and handlers
 */
export function useImageUpload(options: ImageUploadOptions = {}): ImageUploadResult {
  const [image, setImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ImageUploadResult['stats']>(null)

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true)
    setError(null)

    try {
      // Validate the image
      const validationError = validateImage(file)
      if (validationError) {
        setError(validationError)
        if (options.onError) options.onError(validationError)
        return null
      }

      // Process the image
      const result = await processImage(file, {
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight,
        quality: options.quality,
        preset: options.preset
      })

      if (!result) {
        const errorMessage = 'Impossible de traiter l\'image'
        setError(errorMessage)
        if (options.onError) options.onError(errorMessage)
        return null
      }

      // Update state with the processed image
      setImage(result.dataUrl)

      // Update stats
      setStats({
        originalSize: result.originalSize,
        compressedSize: result.sizeInBytes,
        compressionRatio: result.compressionRatio,
        width: result.width,
        height: result.height
      })

      // Call success callback if provided
      if (options.onSuccess) options.onSuccess(result.dataUrl)

      return result.dataUrl
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du traitement de l\'image'
      setError(errorMessage)
      if (options.onError) options.onError(errorMessage)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [options])

  const reset = useCallback(() => {
    setImage(null)
    setError(null)
    setStats(null)
  }, [])

  return { image, isUploading, error, upload, reset, stats }
}

export default useImageUpload