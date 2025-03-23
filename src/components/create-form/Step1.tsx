import { useState, useCallback } from 'react'
import Image from 'next/image'
import { FadeIn } from '@/components/ui/motion'
import { FormStepProps } from './types'
import { TailwindColor, DEFAULT_DAY_MOMENTS, SINGLE_DAY_MOMENT, DayMoment } from '@/app/create/types'
import { Button, ColorButton } from '@/components/ui/Button'
import useImageUpload from '@/lib/hooks/useImageUpload'
import DayMomentManager from './DayMomentManager'

function Step1({
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

  // Définir le type pour les groupes de couleurs
  type ColorGroupName = 'Rouge/Orange/Jaune' | 'Vert' | 'Bleu' | 'Violet/Rose' | 'Gris';

  // Regrouper les couleurs
  const colorGroups: Record<ColorGroupName, TailwindColor[]> = {
    'Rouge/Orange/Jaune': ['red', 'orange', 'amber', 'yellow'],
    'Vert': ['lime', 'green', 'emerald', 'teal'],
    'Bleu': ['cyan', 'sky', 'blue', 'indigo'],
    'Violet/Rose': ['violet', 'purple', 'fuchsia', 'pink', 'rose'],
    'Gris': ['slate', 'gray', 'zinc', 'neutral', 'stone'],
  };

  // Handler for day moments update from DayMomentManager
  const handleDayMomentsChange = (newMoments: DayMoment[]) => {
    updateFormField('dayMoments', newMoments);
  };

  return (
    <FadeIn>
      <div className="bg-white p-6 rounded-lg shadow-md">

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">
              Le calendrier sera au format A4 paysage
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Image de fond</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              {formData.backgroundImage ? (
                <div className="space-y-3">
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={formData.backgroundImage || ''}
                      alt="Fond du calendrier"
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  {backgroundUpload.stats && (
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Taille: {Math.round(backgroundUpload.stats.compressedSize / 1024)} Ko</span>
                      <span>Dimensions: {backgroundUpload.stats.width} × {backgroundUpload.stats.height}</span>
                      <span>Compression: {Math.round((1 - backgroundUpload.stats.compressionRatio) * 100)}%</span>
                    </div>
                  )}
                  <Button
                    onClick={removeBackgroundImage}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Supprimer l&apos;image
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-100">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {isUploading ? "Chargement..." : "Cliquez pour choisir une image"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, WebP (max. 5 Mo)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleBackgroundUpload} />
                </label>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Thème de couleur</h3>
            <div className="space-y-4">
              {Object.entries(colorGroups).map(([groupName, colors]) => (
                <div key={groupName}>
                  <h4 className="text-sm text-gray-700 mb-2">{groupName}</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <div className="w-[clamp(2.4rem,12%,100%)] flex-none" key={color}>
                        <ColorButton
                          colorClass={`bg-${color}-500 border-${color}-600`}
                          colorName={color}
                          isSelected={formData.theme === color}
                          onClick={() => updateFormField('theme', color)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Options</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="uppercase-weekdays"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.options.uppercaseWeekdays}
                  onChange={(e) => {
                    updateFormField('options', {
                      ...formData.options,
                      uppercaseWeekdays: e.target.checked
                    })
                  }}
                />
                <label htmlFor="uppercase-weekdays" className="ml-2 text-sm font-medium text-gray-700">
                  Jours de la semaine en majuscules
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-day-moments"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.options.showDayMoments}
                  onChange={(e) => {
                    // Mettre à jour l'option showDayMoments
                    updateFormField('options', {
                      ...formData.options,
                      showDayMoments: e.target.checked
                    });

                    // Mettre à jour les moments en fonction de l'option
                    if (!e.target.checked) {
                      updateFormField('dayMoments', SINGLE_DAY_MOMENT);
                    } else if (formData.dayMoments.length === 1) {
                      // Only replace if currently using SINGLE_DAY_MOMENT
                      updateFormField('dayMoments', DEFAULT_DAY_MOMENTS);
                    }
                  }}
                />
                <label htmlFor="show-day-moments" className="ml-2 text-sm font-medium text-gray-700">
                  Afficher les moments de la journée (Matin, Après-midi, Soir)
                </label>
              </div>
            </div>
          </div>

          {/* Day Moments Manager - only show when showDayMoments is enabled */}
          {formData.options.showDayMoments && (
            <DayMomentManager
              moments={formData.dayMoments}
              onChange={handleDayMomentsChange}
            />
          )}
        </div>
      </div>
    </FadeIn>
  )
}

export default Step1