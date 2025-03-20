/**
 * Image processing utilities
 * Handles resizing, compression and validation of images
 */

// Constants for image processing
const MAX_IMAGE_SIZE_MB = 5
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

// Presets for different image types
export const IMAGE_PRESETS = {
  BACKGROUND: {
    maxWidth: 2400,
    maxHeight: 1600,
    quality: 0.75,
    name: 'background'
  },
  STICKER: {
    maxWidth: 600,
    maxHeight: 600,
    quality: 0.85,
    name: 'sticker'
  },
  CHILD_PHOTO: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.9,
    name: 'child_photo'
  }
}

interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  preset?: keyof typeof IMAGE_PRESETS
}

interface ProcessedImage {
  dataUrl: string
  width: number
  height: number
  sizeInBytes: number
  originalSize: number
  compressionRatio: number
}

/**
 * Validates an image file
 * @param file The file to validate
 * @returns An error message if validation fails, null otherwise
 */
export function validateImage(file: File): string | null {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return 'Le fichier doit être une image (JPG, PNG)'
  }

  // Check file size
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `L'image ne doit pas dépasser ${MAX_IMAGE_SIZE_MB} Mo`
  }

  return null
}

/**
 * Compresses and resizes an image file
 * @param file The image file to process
 * @param options Optional processing options or preset name
 * @returns A promise that resolves with the processed image data URL
 */
export async function processImage(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage | null> {
  try {
    // Validate the image first
    const validationError = validateImage(file)
    if (validationError) {
      console.error(validationError)
      return null
    }

    // If preset is specified, use those settings
    let settings = { ...options }
    if (options.preset && IMAGE_PRESETS[options.preset]) {
      const preset = IMAGE_PRESETS[options.preset]
      settings = {
        ...settings,
        maxWidth: options.maxWidth || preset.maxWidth,
        maxHeight: options.maxHeight || preset.maxHeight,
        quality: options.quality || preset.quality
      }
    }

    // Set defaults if still not specified
    const maxWidth = settings.maxWidth || IMAGE_PRESETS.STICKER.maxWidth
    const maxHeight = settings.maxHeight || IMAGE_PRESETS.STICKER.maxHeight
    const quality = settings.quality ||
      (file.type === 'image/png' ? 0.8 : 0.8)

    // Create a file reader to read the file
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error('Failed to read file'))
          return
        }

        // Create an image element to get dimensions
        const img = new Image()
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = Math.floor(width * ratio)
            height = Math.floor(height * ratio)
          }

          // Create a canvas for resizing and compression
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          // Draw and compress the image
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          // Convert to data URL with compression
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
          const dataUrl = canvas.toDataURL(outputType, quality)

          // Estimate the size in bytes (Base64 string length * 0.75 is approximate)
          const base64Data = dataUrl.split(',')[1]
          const sizeInBytes = Math.ceil(base64Data.length * 0.75)

          // Calculate compression ratio
          const compressionRatio = file.size > 0 ? sizeInBytes / file.size : 1

          resolve({
            dataUrl,
            width,
            height,
            sizeInBytes,
            originalSize: file.size,
            compressionRatio
          })
        }

        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }

        // Set the source of the image to the data URL
        img.src = event.target.result as string
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsDataURL(file)
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return null
  }
}

/**
 * Process an image using a specific preset
 * @param file The image file to process
 * @param preset The preset to use
 * @returns A promise that resolves with the processed image data URL or null
 */
export async function processImageWithPreset(
  file: File,
  preset: keyof typeof IMAGE_PRESETS
): Promise<string | null> {
  const result = await processImage(file, { preset })
  return result ? result.dataUrl : null
}