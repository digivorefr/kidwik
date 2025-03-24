export interface Pictogram {
  id: number
  keywords: Array<{
    keyword: string
    type: number
    meaning: string
    plural: string
  }>
  created: string
  lastUpdated: string
  published: boolean
  validated: boolean
  license: string
  downloads: number
  tags: string[]
  categories: string[]
  sex: string
  // ARASAAC might return more fields, but these are the ones we'll use
}

export interface ArasaacActivity {
  id: string
  name: string
  icon: string
  isPreset: boolean
  isArasaac: boolean
  attribution: string
  originalId: number
} 