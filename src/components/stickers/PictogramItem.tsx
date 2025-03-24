'use client'

import { useQuery } from '@tanstack/react-query'
import { getPictogramDetails, getPictogramImageUrl } from '@/lib/api/arasaac'
import { ArasaacActivity } from '@/types/pictogram'

interface PictogramItemProps {
  id: number
  onSelect: (activity: ArasaacActivity) => void
}

export function PictogramItem({ id, onSelect }: PictogramItemProps) {
  const { data: pictogram, isLoading, error } = useQuery({
    queryKey: ['pictogram', id],
    queryFn: () => getPictogramDetails(id),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })
  
  if (isLoading) {
    return (
      <div className="aspect-square bg-gray-100 animate-pulse rounded flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
      </div>
    )
  }

  console.log('pictogram', pictogram);
  console.log('error', error);
  
  if (error || !pictogram) {
    return (
      <div className="aspect-square bg-red-50 rounded flex items-center justify-center text-xs text-red-500">
        Erreur
      </div>
    )
  }
  
  const imageUrl = getPictogramImageUrl(id)
  console.log('image url', imageUrl);
  
  // Get French keyword if available, otherwise use a default name
  const keywords = pictogram.keywords || [];
  const frenchKeyword = Array.isArray(keywords) ? keywords.find(k => k.keyword) : null;
  const name = frenchKeyword?.keyword || `Pictogramme ${id}`
  
  return (
    <button
      onClick={() => onSelect({
        id: `arasaac-${id}`,
        name,
        icon: imageUrl,
        isPreset: false,
        isArasaac: true,
        attribution: 'ARASAAC',
        originalId: id
      })}
      className="flex flex-col items-center p-2 border rounded hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--kiwi)]"
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imageUrl} 
        alt={name}
        className="w-full aspect-square object-contain"
        loading="lazy"
      />
      <span className="text-xs mt-1 text-center truncate w-full">{name}</span>
    </button>
  )
} 