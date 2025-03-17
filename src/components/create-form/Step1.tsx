import { useState } from 'react'
import Image from 'next/image'
import { FadeIn } from '@/components/ui/motion'
import { FormStepProps } from './types'
import { TailwindColor } from '@/app/create/types'

function Step1({ 
  formData, 
  updateFormField, 
  onNextStep, 
  handleBackgroundImageUpload, 
  removeBackgroundImage 
}: FormStepProps) {
  const [isUploading, setIsUploading] = useState(false)
  
  // Définir le type pour les groupes de couleurs
  type ColorGroupName = 'Rouge/Orange/Jaune' | 'Vert' | 'Bleu' | 'Violet/Rose' | 'Gris';
  const [selectedColorGroup, setSelectedColorGroup] = useState<ColorGroupName | null>(null)

  // Toutes les couleurs Tailwind organisées par groupes
  const colorGroups: Record<ColorGroupName, TailwindColor[]> = {
    'Rouge/Orange/Jaune': ['red', 'orange', 'amber', 'yellow'],
    'Vert': ['lime', 'green', 'emerald', 'teal'],
    'Bleu': ['cyan', 'sky', 'blue', 'indigo'],
    'Violet/Rose': ['violet', 'purple', 'fuchsia', 'pink', 'rose'],
    'Gris': ['slate', 'gray', 'zinc', 'neutral', 'stone']
  }

  // Fonction pour obtenir les classes CSS en fonction de la couleur
  const getColorClasses = (color: TailwindColor) => {
    const colorMap: Record<TailwindColor, string> = {
      'red': 'bg-red-500 border-red-600',
      'orange': 'bg-orange-500 border-orange-600',
      'amber': 'bg-amber-500 border-amber-600',
      'yellow': 'bg-yellow-500 border-yellow-600',
      'lime': 'bg-lime-500 border-lime-600',
      'green': 'bg-green-500 border-green-600',
      'emerald': 'bg-emerald-500 border-emerald-600',
      'teal': 'bg-teal-500 border-teal-600',
      'cyan': 'bg-cyan-500 border-cyan-600',
      'sky': 'bg-sky-500 border-sky-600',
      'blue': 'bg-blue-500 border-blue-600',
      'indigo': 'bg-indigo-500 border-indigo-600',
      'violet': 'bg-violet-500 border-violet-600',
      'purple': 'bg-purple-500 border-purple-600',
      'fuchsia': 'bg-fuchsia-500 border-fuchsia-600',
      'pink': 'bg-pink-500 border-pink-600',
      'rose': 'bg-rose-500 border-rose-600',
      'slate': 'bg-slate-500 border-slate-600',
      'gray': 'bg-gray-500 border-gray-600',
      'zinc': 'bg-zinc-500 border-zinc-600',
      'neutral': 'bg-neutral-500 border-neutral-600',
      'stone': 'bg-stone-500 border-stone-600'
    }
    
    return colorMap[color]
  }

  // Fonction pour obtenir le nom français d'une couleur
  const getColorName = (color: TailwindColor) => {
    const nameMap: Record<TailwindColor, string> = {
      'red': 'Rouge',
      'orange': 'Orange',
      'amber': 'Ambre',
      'yellow': 'Jaune',
      'lime': 'Citron vert',
      'green': 'Vert',
      'emerald': 'Émeraude',
      'teal': 'Bleu-vert',
      'cyan': 'Cyan',
      'sky': 'Ciel',
      'blue': 'Bleu',
      'indigo': 'Indigo',
      'violet': 'Violet',
      'purple': 'Pourpre',
      'fuchsia': 'Fuchsia',
      'pink': 'Rose',
      'rose': 'Rose vif',
      'slate': 'Ardoise',
      'gray': 'Gris',
      'zinc': 'Zinc',
      'neutral': 'Neutre',
      'stone': 'Pierre'
    }
    
    return nameMap[color]
  }

  // Tous les groupes de couleurs ou juste un groupe spécifique sélectionné
  const colorsToDisplay = selectedColorGroup 
    ? colorGroups[selectedColorGroup] 
    : Object.values(colorGroups).flat()

  return (
    <FadeIn>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold mt-4 sm:mt-0 sm:mb-0">Personnalisation du calendrier</h2>
          
          <div className="flex sm:ml-4 whitespace-nowrap">
            <button
              onClick={onNextStep}
              className="btn-primary px-4 py-1.5 text-sm rounded-full font-medium"
            >
              Continuer
            </button>
          </div>
        </div>
        
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
                  <button
                    onClick={() => removeBackgroundImage && removeBackgroundImage()}
                    className="text-red-500 text-sm font-medium flex items-center"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer l&apos;image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Ajoutez une image de fond à votre calendrier (optionnel)
                  </p>
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">
                        {isUploading ? "Chargement..." : "Choisir une image"}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        setIsUploading(true);
                        if (handleBackgroundImageUpload) {
                          handleBackgroundImageUpload(e);
                        }
                        setIsUploading(false);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Thème de couleur</h3>
            
            {/* Filtres par groupe de couleur */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedColorGroup === null ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedColorGroup(null)}
              >
                Toutes
              </button>
              {Object.keys(colorGroups).map(group => (
                <button 
                  key={group}
                  className={`px-3 py-1 text-sm rounded-full ${selectedColorGroup === group ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedColorGroup(group as ColorGroupName)}
                >
                  {group}
                </button>
              ))}
            </div>
            
            {/* Grille de couleurs */}
            <div className="flex flex-wrap gap-3 mb-2 relative text-center">
              {colorsToDisplay.map(color => (
                <div key={color} className="relative w-[clamp(2.4rem,12%,100%)] flex flex-col items-center">
                  <button 
                    className={`w-full h-auto aspect-square rounded-full border-2 cursor-pointer ${getColorClasses(color)} ${formData.theme === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                    aria-label={`Thème ${getColorName(color)}`}
                    onClick={() => updateFormField('theme', color)}
                  />
                  <span className="text-xs mt-1 text-gray-600">{getColorName(color)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

export default Step1