'use client'

import React from 'react'
import { Activity } from '@/app/create/types'
import StickerPreview from './StickerPreview'
import ImageStickerPreview from './ImageStickerPreview'
import { getThemeClasses } from './types'

interface StickerSheetProps {
  childPhoto: string | null;
  selectedActivities: Activity[];
  themeClasses: ReturnType<typeof getThemeClasses>;
  stickerQuantities: Record<string, number>;
}

export default function StickerSheet({ 
  childPhoto, 
  selectedActivities,
  themeClasses,
  stickerQuantities
}: StickerSheetProps) {
  // Helper function to get quantity or default to 1
  const getQuantity = (id: string) => stickerQuantities[id] || 1;
  
  // Helper function to render multiple copies of a sticker
  const renderMultipleStickers = (id: string, renderFn: () => React.ReactNode) => {
    const quantity = getQuantity(id);
    const stickers = [];
    
    for (let i = 0; i < quantity; i++) {
      stickers.push(
        <div key={`${id}-${i}`} className="flex flex-col items-center">
          {renderFn()}
        </div>
      );
    }
    
    return stickers;
  };
  
  return (
    <div className="sticker-sheet w-full h-auto aspect-[297/210] bg-white p-6 min-w-fit flex flex-col gap-4 paper-shadow">
      <div className={`${themeClasses.headerBg} flex-none rounded-lg p-3 mb-4 text-center`}>
        <h3 className="text-xl font-bold text-white">
          Mes Gommettes à Découper
        </h3>
      </div>
      
      {/* Introduction text */}
      <div className="text-sm text-center text-gray-600 mb-2">
        Découpez les gommettes ci-dessous et utilisez-les pour marquer les activités sur votre calendrier.
      </div>
      
      <div className="flex-auto">
        <div className="flex flex-wrap gap-[0.8cm] justify-start">
          {/* Child's photo stickers */}
          {childPhoto && (
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-700 mb-2 text-center bg-gray-100 rounded-md py-1">
                Photo ({getQuantity('childPhoto')})
              </div>
              <div className="flex flex-wrap gap-[0.8cm]">
                {renderMultipleStickers('childPhoto', () => (
                  <ImageStickerPreview 
                    image={childPhoto}
                    themeClasses={themeClasses}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Group activities by type for better organization */}
          {selectedActivities.length > 0 && (
            <div className="w-full">
              <div className="text-sm font-semibold mb-3 mt-2">Activités</div>
              <div className="flex flex-wrap gap-[1.2cm] justify-start">
                {selectedActivities.map((activity) => (
                  <div key={activity.id} className="mb-6">
                    <div className="text-xs font-semibold text-gray-700 mb-2 text-center bg-gray-100 rounded-md py-1">
                      {activity.name} ({getQuantity(activity.id)})
                    </div>
                    <div className="flex flex-wrap gap-[0.8cm]">
                      {renderMultipleStickers(activity.id, () => (
                        <StickerPreview 
                          activity={activity}
                          themeClasses={themeClasses}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}