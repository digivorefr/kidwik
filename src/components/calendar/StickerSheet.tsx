'use client'

import React, { useMemo } from 'react'
import { Activity } from '@/app/create/types'
import StickerPreview from './StickerPreview'
import ImageStickerPreview from './ImageStickerPreview'
import { getThemeClasses } from './types'
import { cn } from '@/lib/utils/cn'

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
  // Collect all stickers in one array (including child photo if exists)
  const stickers = useMemo(() => {
    // Helper function to get quantity or default to 1
    const getQuantity = (id: string) => stickerQuantities[id] || 1;
    
    const allStickers = [];

    // Add all activity stickers
    // Using reverse() to show the most recently added stickers first
    const reversedActivities = [...selectedActivities].reverse();
    
    for (const activity of reversedActivities) {
      for (let i = 0; i < getQuantity(activity.id); i++) {
        allStickers.push(
          <div key={`${activity.id}-${i}`} className="flex items-center justify-center">
            <StickerPreview 
              activity={activity}
              themeClasses={themeClasses}
              />
          </div>
        );
      }
    }

    // Add child photo stickers if they exist
    if (childPhoto) {
      for (let i = 0; i < getQuantity('childPhoto'); i++) {
        allStickers.push(
          <div key={`childPhoto-${i}`} className="flex items-center justify-center">
            <ImageStickerPreview 
              image={childPhoto}
              themeClasses={themeClasses}
              isHeroImage={true}
            />
          </div>
        );
      }
    }

    // Split stickers into arrays of 45 elements max
    const chunkedStickers = [];
    for (let i = 0; i < allStickers.length; i += 45) {
      chunkedStickers.push(allStickers.slice(i, i + 45));
    }
    return chunkedStickers;
  }, [selectedActivities, childPhoto, stickerQuantities, themeClasses]);
  
  return (
    <div className="a4 paper-shadow">
      {stickers.length === 0 && (
        <div
          className={cn(
            'sticker-sheet w-full min-h-full bg-white p-6 min-w-fit flex flex-col gap-13 m-0',
          )}
        >
          <div className={`${themeClasses.headerBg} flex-none rounded-lg p-3 text-center`}>
            <h3 className="text-xl text-white m-0">
              {`Mes Gommettes à Découper`}
            </h3>
          </div>
          <div className="flex-auto flex flex-col items-center justify-center text-center">
            <span className="text-sm text-zinc-500">
              Ajoutez des activités pour remplir cette page blanche
            </span>
          </div>
        </div>
      )}
      <div id="stickers-preview">
        {stickers.map((chunk, index) => (
          <div 
            key={index}
            className={cn(
              'sticker-sheet w-full min-h-full bg-white p-6 min-w-fit flex flex-col gap-13 m-0',
            )}
          >
            <div className={`${themeClasses.headerBg} flex-none rounded-lg p-3 text-center`}>
              <h3 className="text-xl text-white m-0">
                {`Mes Gommettes à Découper${stickers.length > 1 ? ` ${index + 1}/${stickers.length}` : ''}`}
              </h3>
            </div>
            
            {/* Introduction text */}
            <div className="text-sm text-center text-gray-600">
              Découpez les gommettes ci-dessous et utilisez-les pour marquer les activités sur votre calendrier.
            </div>
            
            {/* Adaptive grid layout for all stickers */}
            <div className="flex-auto">
              <div className="grid grid-cols-[repeat(auto-fill,2cm)] gap-[1cm] justify-center items-start">
                {chunk}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}