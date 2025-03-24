'use client'

export function ArasaacAttribution() {
  return (
    <div className="text-xs text-gray-500 mt-4">
      Pictogrammes par{' '}
      <a 
        href="https://arasaac.org" 
        target="_blank" 
        rel="noreferrer"
        className="underline text-[var(--kiwi-darker)]"
      >
        ARASAAC
      </a>{' '}
      sous licence{' '}
      <a 
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
        target="_blank" 
        rel="noreferrer"
        className="underline text-[var(--kiwi-darker)]"
      >
        Creative Commons BY-NC-SA 4.0
      </a>
    </div>
  )
} 