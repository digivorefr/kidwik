'use client'

import { cn } from '@/lib/utils/cn';
import { getThemeClasses } from './types'

interface ImageStickerPreviewProps {
  image: string;
  themeClasses: ReturnType<typeof getThemeClasses>;
  objectFit?: 'cover' | 'contain';
}

export default function ImageStickerPreview({ 
  image, 
  themeClasses,
  objectFit = 'cover'
}: ImageStickerPreviewProps) {
  return (
    <div className={cn(
      'child-sticker-preview relative',
      themeClasses.stickerBg,
      'w-[2cm] h-[2cm] rounded-full overflow-hidden border-[0.25cqi]',
      themeClasses.stickerBorder,
      objectFit === 'contain' && 'p-[0.8cqi]'
    )}>
      <div 
        className={`w-full h-full flex items-center justify-center`}
        style={{ 
          backgroundImage: `url(${image})`,
          backgroundSize: objectFit,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
    </div>
  )
}