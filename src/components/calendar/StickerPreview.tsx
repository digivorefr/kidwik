'use client'

import { Activity } from '@/app/create/types'
import { getThemeClasses } from './types'
import ImageStickerPreview from './ImageStickerPreview'
import { cn } from '@/lib/utils/cn';

interface StickerPreviewProps {
  activity: Activity;
  themeClasses: ReturnType<typeof getThemeClasses>;
  allowObjectFitToggle?: boolean;
  onObjectFitToggle?: (id: string, objectFit: 'cover' | 'contain') => void;
}

export default function StickerPreview({ 
  activity, 
  themeClasses, 
  allowObjectFitToggle = false,
  onObjectFitToggle
}: StickerPreviewProps) {
  // Déterminer si l'icône est une URL d'image ou un emoji
  const isImageUrl = activity.icon && (
    activity.icon.startsWith('data:') ||
    activity.icon.startsWith('http')
  );

  // Object fit mode (default to 'cover' if not specified)
  const objectFit = activity.objectFit || 'cover';

  // Si c'est une image, utiliser ImageStickerPreview
  if (isImageUrl) {
    return (
      <div className="relative">
        <ImageStickerPreview 
          image={activity.icon as string} 
          themeClasses={themeClasses} 
          objectFit={objectFit}
        />
        
        {allowObjectFitToggle && onObjectFitToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const newObjectFit = objectFit === 'cover' ? 'contain' : 'cover';
              onObjectFitToggle(activity.id, newObjectFit);
            }}
            className="absolute cursor-pointer bottom-0 right-0 bg-white/80 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm border border-gray-200"
            title={objectFit === 'cover' ? 'Changer en mode ajusté' : 'Changer en mode remplissage'}
          >
            {objectFit === 'cover' ? (
              // Icon for "contain" mode
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="7" y="7" width="10" height="10" rx="1" />
              </svg>
            ) : (
              // Icon for "cover" mode
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="12" cy="12" r="5" />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  }

  // Sinon, afficher l'emoji comme avant
  return (
    <div className={cn(
      'sticker-preview',
      themeClasses.stickerBg,
      'w-[2cm] h-[2cm] rounded-full flex items-center justify-center border-4 @container',
      themeClasses.stickerBorder
    )}>
      <span className="text-[60cqw]">{activity.icon}</span>
    </div>
  )
}