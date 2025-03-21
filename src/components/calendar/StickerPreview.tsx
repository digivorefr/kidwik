'use client'

import { Activity } from '@/app/create/types'
import { getThemeClasses } from './types'
import ImageStickerPreview from './ImageStickerPreview'
import { cn } from '@/lib/utils/cn';

interface StickerPreviewProps {
  activity: Activity;
  themeClasses: ReturnType<typeof getThemeClasses>;
}

export default function StickerPreview({ activity, themeClasses }: StickerPreviewProps) {
  // Déterminer si l'icône est une URL d'image ou un emoji
  const isImageUrl = activity.icon && (
    activity.icon.startsWith('data:') ||
    activity.icon.startsWith('http')
  );

  // Si c'est une image, utiliser ImageStickerPreview
  if (isImageUrl) {
    return <ImageStickerPreview image={activity.icon as string} themeClasses={themeClasses} />
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