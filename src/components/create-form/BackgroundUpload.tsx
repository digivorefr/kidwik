import { useCallback, useState } from "react";
import { FormStepProps } from "./types";
import useImageUpload from "@/lib/hooks/useImageUpload";
import Image from "next/image";
import { Button } from "../ui/Button";

export default function BackgroundUpload({
  formData,
  updateFormField,
  removeBackgroundImage
}: FormStepProps) {
  const [isUploading, setIsUploading] = useState(false)

  // Image upload hook for background image with BACKGROUND preset
  const backgroundUpload = useImageUpload({
    preset: 'BACKGROUND',
    onSuccess: (dataUrl) => {
      // Call the parent's handler to update form state
      updateFormField('backgroundImage', dataUrl)
      setIsUploading(false)
    },
    onError: (error) => {
      console.error('Error uploading background:', error)
      setIsUploading(false)
      alert(error)
    }
  })

  // Handler for background image upload
  const handleBackgroundUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    await backgroundUpload.upload(file)
  }, [backgroundUpload])

  return (
    <>
      {formData.backgroundImage ? (
        <div className="space-y-3">
          <div className="relative w-full h-32 bg-zinc-800 rounded-lg overflow-hidden">
            <Image
              src={formData.backgroundImage || ''}
              alt="Fond du calendrier"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          {backgroundUpload.stats && (
            <div className="text-xs text-zinc-300 grid gap-1">
              <span>Taille: {Math.round(backgroundUpload.stats.compressedSize / 1024)} Ko</span>
              <span>Dimensions: {backgroundUpload.stats.width} × {backgroundUpload.stats.height}</span>
              <span>Compression: {Math.round((1 - backgroundUpload.stats.compressionRatio) * 100)}%</span>
            </div>
          )}
          <Button
            onClick={removeBackgroundImage}
            variant="color"
            size="sm"
            className="w-full flex gap-1 items-center"
          >
            <span className="material-symbols-rounded">delete</span>
            <span>Supprimer l&apos;image</span>
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 rounded-lg p-6 cursor-pointer hover:bg-zinc-900">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm font-medium">
              {isUploading ? "Chargement..." : "Cliquez pour choisir une image"}
            </p>
            <p className="mt-1 text-xs text-zinc-300">PNG, JPG, WebP (max. 20 Mo)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleBackgroundUpload} />
        </label>
      )}
    </>
  )
}