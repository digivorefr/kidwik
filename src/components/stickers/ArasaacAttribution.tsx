'use client'

export function ArasaacAttribution() {
  return (
    <div className="text-xs text-zinc-400 mt-4">
      Pictogrammes par{' '}
      <a 
        href="https://arasaac.org" 
        target="_blank" 
        rel="noreferrer"
        className="underline text-[var(--kiwi-light)]"
      >
        ARASAAC
      </a>{' '}
      sous licence{' '}
      <a 
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
        target="_blank" 
        rel="noreferrer"
        className="underline text-[var(--kiwi-light)]"
      >
        Creative Commons BY-NC-SA 4.0
      </a>
    </div>
  )
} 