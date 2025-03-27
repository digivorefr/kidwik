import { useCallback, useState } from "react";
import { FormStepProps } from "./types";
import useImageUpload from "@/lib/hooks/useImageUpload";
import Image from "next/image";
import { Button } from "../ui/Button";
import { ArasaacAttribution, ArasaacSearch } from "../stickers";
import { ArasaacActivity } from "@/types/pictogram";

type AddStickerProps = FormStepProps & {
  onNavigateToStickersList?: () => void
}

export default function AddSticker({
  formData, 
  updateFormField,
  availableIcons,
  onNavigateToStickersList,
}: AddStickerProps) {
  const [modalTab, setModalTab] = useState<'upload' | 'icons' | 'arasaac'>('arasaac')

  // Image upload hook for custom stickers
  const customStickerUpload = useImageUpload({
    preset: 'STICKER',
    onSuccess: (dataUrl) => {
      // Store the processed image
      addCustomImageActivity(dataUrl)
    },
    onError: (error) => {
      console.error('Error uploading custom sticker:', error)
      alert(error)
    }
  })

  const addCustomImageActivity = useCallback((imageDataUrl: string) => {
    if (imageDataUrl) {
      const newActivity = {
        id: `custom-img-${Date.now()}`,
        name: 'Personnalisé',
        icon: imageDataUrl
      }

      updateFormField('customActivities', [...formData.customActivities, newActivity])
      updateFormField('selectedActivities', [...formData.selectedActivities, newActivity])

      // Set default quantity to 1
      updateFormField('stickerQuantities', {
        ...formData.stickerQuantities,
        [newActivity.id]: 1
      })

      // Reset and close
      customStickerUpload.reset()
      if (onNavigateToStickersList) {
        onNavigateToStickersList()
      }
    }
  }, [formData.customActivities, formData.selectedActivities, formData.stickerQuantities, updateFormField, customStickerUpload, onNavigateToStickersList])

  const addCustomIconActivity = useCallback((icon: string) => {
    const newActivity = {
      id: `custom-icon-${Date.now()}`,
      name: 'Personnalisé',
      icon
    }

    updateFormField('customActivities', [...formData.customActivities, newActivity])
    updateFormField('selectedActivities', [...formData.selectedActivities, newActivity])

    // Set default quantity to 1
    updateFormField('stickerQuantities', {
      ...formData.stickerQuantities,
      [newActivity.id]: 1
    })
    if (onNavigateToStickersList) {
      onNavigateToStickersList()
    }
  }, [formData.customActivities, formData.selectedActivities, formData.stickerQuantities, updateFormField, onNavigateToStickersList])

  // Handler for custom image upload
  const handleCustomImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await customStickerUpload.upload(file)
  }, [customStickerUpload])

  // Handler for ARASAAC pictogram selection
  const handleArasaacSelection = useCallback((pictogram: ArasaacActivity) => {
    updateFormField('customActivities', [...formData.customActivities, pictogram])
    updateFormField('selectedActivities', [...formData.selectedActivities, pictogram])

    // Set default quantity to 1
    updateFormField('stickerQuantities', {
      ...formData.stickerQuantities,
      [pictogram.id]: 1
    })
    if (onNavigateToStickersList) {
      onNavigateToStickersList()
    }
  }, [formData.customActivities, formData.selectedActivities, formData.stickerQuantities, updateFormField, onNavigateToStickersList])

  return (
    <div className="relative min-w-80">
      <div className="mb-4 grid grid-cols-3 gap-2 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.1)]">
        <button
          className={`p-2 text-left text-xs ${modalTab === 'arasaac' ? 'border-b-2 border-[var(--kiwi-light)] text-[var(--kiwi-light)] font-medium' : 'text-zinc-200'}`}
          onClick={() => setModalTab('arasaac')}
        >
          Pictogrammes ARASAAC
        </button>
        <button
          className={`p-2 text-left text-xs ${modalTab === 'upload' ? 'border-b-2 border-[var(--kiwi-light)] text-[var(--kiwi-light)] font-medium' : 'text-zinc-200'}`}
          onClick={() => setModalTab('upload')}
        >
          Uploader une photo
        </button>
        <button
          className={`p-2 text-left text-xs ${modalTab === 'icons' ? 'border-b-2 border-[var(--kiwi-light)] text-[var(--kiwi-light)] font-medium' : 'text-zinc-200'}`}
          onClick={() => setModalTab('icons')}
        >
          Utiliser des emojis
        </button>
      </div>

      {modalTab === 'upload' && (
        <div className="space-y-4">
          {customStickerUpload.image ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 relative border rounded-lg overflow-hidden">
                  <Image
                    src={customStickerUpload.image}
                    alt="Image personnalisée"
                    className="object-cover object-center w-full h-full"
                    fill
                  />
                </div>
              </div>
              {customStickerUpload.stats && (
                <div className="text-xs text-zinc-200 text-center">
                  <p>Taille: {Math.round(customStickerUpload.stats.compressedSize / 1024)} Ko</p>
                  <p>Compression: {Math.round((1 - customStickerUpload.stats.compressionRatio) * 100)}%</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => customStickerUpload.reset()}
                  variant="outline"
                  className="flex-1"
                >
                  Changer
                </Button>
                <Button
                  onClick={() => {
                    if (customStickerUpload.image) {
                      addCustomImageActivity(customStickerUpload.image)
                    }
                  }}
                  variant="primary"
                  className="flex-1"
                >
                  Ajouter au calendrier
                </Button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 rounded-lg p-8 cursor-pointer hover:bg-zinc-900">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-zinc-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-zinc-300 font-medium">Cliquez pour choisir une image</p>
                <p className="text-sm text-zinc-500 mt-1">JPG, PNG (max. 20 Mo)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomImageUpload}
              />
            </label>
          )}
          {customStickerUpload.error && (
            <p className="text-sm text-red-500 mt-2">{customStickerUpload.error}</p>
          )}
        </div>
      )}

      {modalTab === 'icons' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {availableIcons?.map(icon => (
              <button
                type="button"
                key={icon}
                className="p-2 w-fit h-auto aspect-square border border-zinc-500 rounded hover:bg-zinc-900"
                onClick={() => addCustomIconActivity(icon)}
              >
                <span className="block text-xl leading-none">{icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {modalTab === 'arasaac' && (
        <div className="space-y-4">
          <p className="text-sm">Recherchez un pictogramme par mot-clé:</p>
          <ArasaacSearch onSelectPictogram={handleArasaacSelection} />
          <div className="text-xs text-zinc-400 mb-4">
            <p>ARASAAC propose une collection de pictogrammes utilisés dans la Communication Augmentative et Alternative (CAA) pour faciliter la communication des personnes ayant des difficultés dans ce domaine.</p>
          </div>
          <ArasaacAttribution />
          {onNavigateToStickersList && (
            <div className="flex justify-center">
              <Button
                variant="color"
                size="sm"
                className="flex items-center gap-1"
                onClick={onNavigateToStickersList}
              >
                <div className="material-symbols-rounded">apps</div>
                <span>Voir toutes les activités</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}