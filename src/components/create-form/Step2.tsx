import { useState, useCallback } from 'react'
import { FadeIn } from '@/components/ui/motion'
import { Step2Props } from './types'
import StickerPreview from '@/components/calendar/StickerPreview'
import ImageStickerPreview from '@/components/calendar/ImageStickerPreview'
import { PRESET_ACTIVITIES } from '@/app/create/types'
import Image from 'next/image'
import { Button, IconButton } from '@/components/ui/Button'
import useImageUpload from '@/lib/hooks/useImageUpload'

// Type for our synthetic event with processed image
interface ProcessedImageEvent {
  target: {
    files: [string] // Array with exactly one string (the processed image URL)
  }
}

function Step2({
  formData,
  childPhoto,
  handlePhotoUpload,
  handleActivityToggle,
  updateStickerQuantity,
  updateFormField,
  removeCustomActivity,
  availableIcons,
  themeClasses,
}: Step2Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'upload' | 'icons'>('upload')

  // Image upload hook for child photo
  const childPhotoUpload = useImageUpload({
    preset: 'CHILD_PHOTO',
    onSuccess: () => {
      // We don't need to do anything special in the success callback
      // as we'll handle passing the processed image to the parent in the
      // handleChildPhotoUpload function
    },
    onError: (error) => {
      console.error('Error uploading child photo:', error)
      alert(error)
    }
  })

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

  // Handler for child photo upload
  const handleChildPhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Process the image for optimization
    const processedImageUrl = await childPhotoUpload.upload(file)

    // If processing was successful, pass the processed image directly to the parent
    if (processedImageUrl) {
      // Pass the processed image URL directly to the parent's handlePhotoUpload
      // The parent function has been modified to handle both File objects and direct data URLs
      handlePhotoUpload({
        target: {
          files: [processedImageUrl]
        }
      } as ProcessedImageEvent)
    }
  }, [childPhotoUpload, handlePhotoUpload])

  // Handler for custom image upload
  const handleCustomImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await customStickerUpload.upload(file)
  }, [customStickerUpload])

  // Helper function for quantity controls
  const renderQuantityControls = (activityId: string) => {
    const isSelected = formData.selectedActivities.some(a => a.id === activityId) || (activityId === 'childPhoto' && childPhoto)
    if (!isSelected) return null

    const quantity = formData.stickerQuantities[activityId] || 1

    return (
      <div className="flex items-center justify-center mt-1 bg-gray-100 rounded-full px-0.5 py-0.5">
        <button
          type="button"
          className="w-5 h-5 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 border border-gray-300 text-gray-500 cursor-pointer"
          onClick={(e) => {
            e.preventDefault(); // Prevent checkbox toggle
            e.stopPropagation();
            updateStickerQuantity(activityId, Math.max(1, quantity - 1));
          }}
          aria-label="Réduire la quantité"
        >
          <span className="text-xs font-bold">-</span>
        </button>
        <div className="flex items-center mx-2">
          <span className="text-xs font-medium text-gray-700">{quantity}</span>
          <span className="text-xs ml-1 text-gray-500">copie{quantity > 1 ? 's' : ''}</span>
        </div>
        <button
          type="button"
          className="w-5 h-5 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 border border-gray-300 text-gray-500 cursor-pointer"
          onClick={(e) => {
            e.preventDefault(); // Prevent checkbox toggle
            e.stopPropagation();
            updateStickerQuantity(activityId, quantity + 1);
          }}
          aria-label="Augmenter la quantité"
        >
          <span className="text-xs font-bold">+</span>
        </button>
      </div>
    )
  }

  const addCustomImageActivity = (imageDataUrl: string) => {
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
      setIsModalOpen(false)
    }
  }

  const addCustomIconActivity = (icon: string) => {
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

    // Close modal
    setIsModalOpen(false)
  }

  return (
    <FadeIn>
      <div className="bg-white p-6 rounded-lg shadow-md">

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Gommette portrait de votre enfant</h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <div className="text-gray-500">
                      {childPhoto ? 'Changer la photo' : 'Ajouter une photo'}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG (max. 5 Mo)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChildPhotoUpload}
                  />
                </label>

                {childPhoto && (
                  <div className="flex items-center justify-center">
                    <ImageStickerPreview
                      image={childPhoto}
                      themeClasses={themeClasses}
                    />
                  </div>
                )}
              </div>

              {childPhoto && (
                <>
                  {childPhotoUpload.stats && (
                    <div className="text-xs text-gray-500 flex flex-wrap justify-between">
                      <span>Taille: {Math.round(childPhotoUpload.stats.compressedSize / 1024)} Ko</span>
                      <span>Dimensions: {childPhotoUpload.stats.width} × {childPhotoUpload.stats.height}</span>
                    </div>
                  )}
                  {renderQuantityControls('childPhoto')}
                </>
              )}

              {childPhotoUpload.error && (
                <p className="text-sm text-red-500">{childPhotoUpload.error}</p>
              )}

              <div className="text-sm text-gray-500">
                Cette gommette représente votre enfant et sera déplacée chaque jour sur le calendrier. C&apos;est un élément central qui permet à votre enfant de se repérer plus facilement dans sa semaine.
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Gommettes</h3>
            <p className="text-sm text-gray-600 mb-3">Sélectionnez les gommettes et choisissez combien d&apos;exemplaires de chaque type vous souhaitez imprimer.</p>

            {/* Add custom activity button - Now in first position in a separate block */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Personnalisez avec des photos des lieux familiers (école, crèche, parc préféré...) pour que votre enfant s&apos;identifie plus facilement à son calendrier.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                <span className="text-sm font-medium text-gray-600">Ajouter une gommette personnalisée</span>
              </Button>
            </div>

            {/* Custom activities in a separate block */}
            {formData.customActivities.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-3">Mes gommettes personnalisées</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.customActivities.map(activity => (
                    <div key={activity.id} className="relative">
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formData.selectedActivities.some(a => a.id === activity.id)}
                          onChange={() => handleActivityToggle(activity)}
                        />
                        <div className="flex flex-col items-center space-y-2 p-2 rounded-lg border-2 border-transparent peer-checked:border-[var(--kiwi-dark)] peer-checked:bg-[var(--kiwi-light)]/20">
                          <StickerPreview
                            activity={activity}
                            themeClasses={themeClasses}
                          />
                          <span className="text-sm">{activity.name}</span>
                          {renderQuantityControls(activity.id)}
                        </div>
                      </label>
                      <button
                        onClick={() => removeCustomActivity(activity.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        aria-label="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preset activities in a separate block */}
            <div>
              <h4 className="text-sm font-medium mb-3">Gommettes prédéfinies</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_ACTIVITIES.map(activity => {
                  const isSelected = formData.selectedActivities.some(a => a.id === activity.id);

                  return (
                    <div key={activity.id} className="relative">
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isSelected}
                          onChange={() => {
                            // Seulement permettre la sélection (pas la désélection) par le clic
                            if (!isSelected) {
                              handleActivityToggle(activity);
                            }
                          }}
                        />
                        <div className="flex flex-col items-center space-y-2 p-2 rounded-lg border-2 border-transparent peer-checked:border-[var(--kiwi-dark)] peer-checked:bg-[var(--kiwi-light)]/20">
                          <StickerPreview
                            activity={activity}
                            themeClasses={themeClasses}
                          />
                          <span className="text-sm">{activity.name}</span>
                          {renderQuantityControls(activity.id)}
                        </div>
                      </label>
                      {isSelected && (
                        <button
                          onClick={() => handleActivityToggle(activity)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          aria-label="Supprimer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for adding custom activities */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Ajouter une gommette personnalisée</h3>
                  <IconButton
                    onClick={() => {
                      setIsModalOpen(false)
                      customStickerUpload.reset()
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    ariaLabel="Fermer"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    }
                  />
                </div>

                <div className="mb-4 flex shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.1)]">
                  <button
                    className={`p-2 text-left text-xs ${modalTab === 'upload' ? 'border-b-2 border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium' : 'text-gray-500'}`}
                    onClick={() => setModalTab('upload')}
                  >
                    Uploader une photo
                  </button>
                  <button
                    className={`p-2 text-left text-xs ${modalTab === 'icons' ? 'border-b-2 border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium' : 'text-gray-500'}`}
                    onClick={() => setModalTab('icons')}
                  >
                    Choisir un pictogramme
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
                          <div className="text-xs text-gray-500 text-center">
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
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:bg-gray-50">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-700 font-medium">Cliquez pour choisir une image</p>
                          <p className="text-sm text-gray-500 mt-1">JPG, PNG (max. 5 Mo)</p>
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
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-64 overflow-y-auto pr-4">
                      {availableIcons.map(icon => (
                        <Button
                          key={icon}
                          className="w-fill h-auto aspect-square flex items-center justify-center text-3xl border border-gray-300 rounded hover:bg-gray-100"
                          onClick={() => addCustomIconActivity(icon)}
                          variant="outline"
                        >
                          {icon}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  )
}

export default Step2