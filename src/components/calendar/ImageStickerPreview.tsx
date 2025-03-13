'use client'

import { getThemeClasses } from './types'

interface ImageStickerPreviewProps {
  image: string;
  themeClasses: ReturnType<typeof getThemeClasses>;
}

export default function ImageStickerPreview({ image, themeClasses }: ImageStickerPreviewProps) {
  return (
    <div className={`child-sticker-preview relative ${themeClasses.stickerBg} w-[2cm] h-[2cm] rounded-full overflow-hidden border-4 ${themeClasses.stickerBorder}`}>
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
    </div>
  )
}