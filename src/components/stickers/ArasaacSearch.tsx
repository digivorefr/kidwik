'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchPictograms } from '@/lib/api/arasaac'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { PictogramItem } from './PictogramItem'
import { ArasaacAttribution } from './ArasaacAttribution'
import { ArasaacActivity } from '@/types/pictogram'

interface ArasaacSearchProps {
  onSelectPictogram: (pictogram: ArasaacActivity) => void
}

export function ArasaacSearch({ onSelectPictogram }: ArasaacSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  // Query for pictogram IDs
  const { data: pictogramIds = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['arasaacSearch', debouncedSearch],
    queryFn: () => searchPictograms(debouncedSearch),
    enabled: debouncedSearch.length > 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
  
  // Limit to first 20 results to avoid overwhelming the API
  const visiblePictograms = pictogramIds.slice(0, 20)
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Rechercher un pictogramme..."
          className="flex-grow p-2 border border-zinc-600 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Rechercher des pictogrammes ARASAAC"
        />
      </div>
      
      {/* Search status */}
      {debouncedSearch.length > 0 && debouncedSearch.length < 3 && (
        <p className="text-sm text-gray-500">
          Veuillez saisir au moins 3 caractères pour rechercher.
        </p>
      )}
      
      {isLoading && debouncedSearch.length >= 3 && (
        <p className="text-sm text-gray-500">Recherche en cours...</p>
      )}
      
      {!isLoading && !isFetching && debouncedSearch.length >= 3 && pictogramIds.length === 0 && (
        <p className="text-sm text-gray-500">
          Aucun pictogramme trouvé pour &ldquo;{debouncedSearch}&rdquo;.
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">
          Erreur lors de la recherche. Veuillez réessayer.
        </p>
      )}
      
      {/* Results grid */}
      {pictogramIds.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {visiblePictograms.map(id => (
              <PictogramItem key={id} id={parseInt(id,10)} onSelect={onSelectPictogram} />
            ))}
          </div>
          
          {pictogramIds.length > 20 && (
            <p className="text-sm text-gray-500 mt-2">
              {pictogramIds.length - 20} résultats supplémentaires disponibles. Affinez votre recherche pour voir d&apos;autres pictogrammes.
            </p>
          )}
        </>
      )}
      
      {/* Attribution footer - always show once search has been performed */}
      {debouncedSearch.length > 0 && <ArasaacAttribution />}

    </div>
  )
} 