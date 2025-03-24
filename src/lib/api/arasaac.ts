import { Pictogram } from '@/types/pictogram'

/**
 * Search for pictograms by keyword
 * @param keyword The keyword to search for
 * @returns Array of pictogram IDs
 */
export async function searchPictograms(keyword: string): Promise<string[]> {
  if (!keyword || keyword.length < 2) return []
  
  try {
    const response = await fetch(
      `https://api.arasaac.org/v1/pictograms/fr/bestsearch/${encodeURIComponent(keyword)}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }
    
    // Extract just the IDs from the pictogram objects
    const pictograms = await response.json()
    return pictograms.map((pictogram: { _id: number }) => pictogram._id)
  } catch (error) {
    console.error('Error searching pictograms:', error)
    return []
  }
}

/**
 * Get details for a specific pictogram by ID
 * @param id The pictogram ID
 * @returns Pictogram details
 */
export async function getPictogramDetails(id: number): Promise<Pictogram | null> {
  if (!id) return null
  
  try {
    // This endpoint returns metadata as JSON
    const response = await fetch(
      `https://api.arasaac.org/api/pictograms/fr/${id}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    )
    
    if (!response.ok) {
      throw new Error(`Failed to get pictogram: ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    console.error(`Error fetching pictogram ${id}:`, error)
    return null
  }
}

/**
 * Get the URL for a pictogram image
 * @param id The pictogram ID
 * @returns Full URL to the pictogram image
 */
export function getPictogramImageUrl(id: number, options: {
  download?: boolean,
  plural?: boolean,
  color?: boolean
} = {}): string {
  const { download = false, plural = false, color = true } = options
  return `https://api.arasaac.org/api/pictograms/${id}?download=${download}&plural=${plural}&color=${color}`
} 