'use client'

import { cn } from '@/lib/utils/cn';
import { getThemeClasses } from './types'
import Image from 'next/image';

interface ImageStickerPreviewProps {
  image: string;
  themeClasses: ReturnType<typeof getThemeClasses>;
  objectFit?: 'cover' | 'contain';
  isHeroImage?: boolean;
}

export default function ImageStickerPreview({ 
  image, 
  themeClasses,
  objectFit = 'cover',
  isHeroImage = false
}: ImageStickerPreviewProps) {
  return (
    <div className={cn(
      'child-sticker-preview relative @container',
      'w-[2cm] h-[2cm]',
    )}>
      <div 
        className={cn(
          `w-full h-full flex items-stretch justify-stretch`,
          'rounded-[6cqi] border-[6cqi]',
          themeClasses.stickerBg,
          themeClasses.stickerBorder,
        )}
        >
        <div
          className={cn(
            "flex-auto",
            objectFit === 'contain' && 'm-[12cqi]',
          )}
          style={{ 
            backgroundImage: `url(${image})`,
            backgroundSize: objectFit,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
      {isHeroImage && (
        <Image
          src="/crown.webp"
          alt="Hero Image"
          width={100}
          height={100}
          className="absolute -top-[9cqw] left-[14cqw] -translate-x-1/2 -translate-y-1/2 w-[120cqi] max-w-[unset]"
        />
      )}
    </div>
  )
}