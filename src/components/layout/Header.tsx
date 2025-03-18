'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Header() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path)
  }

  return (
    <header className="bg-white shadow-xl shadow-black/4 py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className={`text-2xl font-bold text-[var(--kiwi-medium)]`}
        >
          KidWik
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link 
                href="/view" 
                className={`transition-colors ${isActive('/view') 
                  ? 'text-[var(--kiwi-darker)] font-medium' 
                  : 'text-[var(--kiwi-dark)] hover:text-[var(--kiwi-darker)]'}`}
              >
                Mes calendriers
              </Link>
            </li>
            <li>
              <Link 
                href="/create/new" 
                className={`transition-colors ${isActive('/create') 
                  ? 'text-[var(--kiwi-darker)] font-medium' 
                  : 'text-[var(--kiwi-dark)] hover:text-[var(--kiwi-darker)]'}`}
              >
                Créer un calendrier
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header