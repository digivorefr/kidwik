import { useState } from 'react'
import { FadeIn } from '@/components/ui/motion'
import { Step2Props } from './types'
import StickerPreview from '@/components/calendar/StickerPreview'
import ImageStickerPreview from '@/components/calendar/ImageStickerPreview'
import { PRESET_ACTIVITIES } from '@/app/create/types'
import Image from 'next/image'

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
  onNextStep,
  onPrevStep
}: Step2Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'upload' | 'icons'>('upload')
  const [customImage, setCustomImage] = useState<string | null>(null)
  
  // Helper function for quantity controls
  const renderQuantityControls = (activityId: string) => {
    const isSelected = formData.selectedActivities.some(a => a.id === activityId) || (activityId === 'childPhoto' && childPhoto)
    if (!isSelected) return null
    
    const quantity = formData.stickerQuantities[activityId] || 1
    
    return (
      <div className="flex items-center justify-center mt-1 bg-gray-100 rounded px-1 py-0.5">
        <button
          type="button"
          className="w-5 h-5 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 border border-gray-300 text-gray-500"
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
          className="w-5 h-5 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 border border-gray-300 text-gray-500"
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
  
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
  
  const addCustomImageActivity = () => {
    if (customImage) {
      const newActivity = {
        id: `custom-img-${Date.now()}`,
        name: 'Personnalisé',
        icon: customImage
      }
      
      updateFormField('customActivities', [...formData.customActivities, newActivity])
      updateFormField('selectedActivities', [...formData.selectedActivities, newActivity])
      
      // Set default quantity to 1
      updateFormField('stickerQuantities', {
        ...formData.stickerQuantities,
        [newActivity.id]: 1
      })
      
      // Reset and close
      setCustomImage(null)
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
        <h2 className="text-xl font-semibold mb-4">Personnalisation des gommettes</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Photo de l&apos;enfant</h3>
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
                    onChange={handlePhotoUpload}
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
              
              {childPhoto && renderQuantityControls('childPhoto')}
              
              <div className="text-sm text-gray-500">
                Cette photo sera utilisée comme gommette à découper et à placer sur le calendrier.
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Activités</h3>
            <p className="text-sm text-gray-600 mb-3">Sélectionnez les activités et choisissez combien de gommettes de chaque type vous souhaitez imprimer.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Preset activities */}
              {PRESET_ACTIVITIES.map(activity => (
                <label key={activity.id} className="cursor-pointer">
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
              ))}
              
              {/* Custom activities that were already added */}
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
              
              {/* Add custom activity button */}
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="flex flex-col items-center justify-center space-y-2 p-4 h-full border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Ajouter</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Modal for adding custom activities */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Ajouter une activité personnalisée</h3>
                  <button 
                    onClick={() => {
                      setIsModalOpen(false)
                      setCustomImage(null)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4 flex shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.1)]">
                  <button
                    className={`px-4 py-2 ${modalTab === 'upload' ? 'border-b-2 border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium' : 'text-gray-500'}`}
                    onClick={() => setModalTab('upload')}
                  >
                    Uploader une image
                  </button>
                  <button
                    className={`px-4 py-2 ${modalTab === 'icons' ? 'border-b-2 border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium' : 'text-gray-500'}`}
                    onClick={() => setModalTab('icons')}
                  >
                    Choisir un pictogramme
                  </button>
                </div>
                
                {modalTab === 'upload' && (
                  <div className="space-y-4">
                    {customImage ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="w-32 h-32 relative border rounded-lg overflow-hidden">
                            <Image 
                              src={customImage} 
                              alt="Image personnalisée" 
                              className="object-cover object-center w-full h-full"
                              fill
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCustomImage(null)}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700"
                          >
                            Changer
                          </button>
                          <button
                            onClick={addCustomImageActivity}
                            className="flex-1 py-2 px-4 bg-[var(--kiwi-dark)] text-white rounded-md"
                          >
                            Ajouter au calendrier
                          </button>
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
                  </div>
                )}
                
                {modalTab === 'icons' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-h-64 overflow-y-auto pr-4">
                      {availableIcons.map(icon => (
                        <button
                          key={icon}
                          className="w-fill h-auto aspect-square flex items-center justify-center text-3xl border border-gray-300 rounded hover:bg-gray-100"
                          onClick={() => addCustomIconActivity(icon)}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={onPrevStep}
            className="px-6 py-2 rounded-lg border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium"
          >
            Retour
          </button>
          <button
            onClick={onNextStep}
            className="btn-primary px-6 py-2 rounded-lg font-medium"
          >
            Continuer
          </button>
        </div>
      </div>
    </FadeIn>
  )
}

export default Step2