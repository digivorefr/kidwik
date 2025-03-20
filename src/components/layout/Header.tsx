'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path)
  }

  return (
    <header className="bg-white shadow-xl shadow-black/4 py-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className={`text-2xl font-bold text-[var(--kiwi-medium)]`}
        >
          <Image src="/kidwik-logo.svg" alt="kidwik" width={100} height={100} />
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/view"
                className={`transition-colors ${isActive('/view')
                  ? 'text-[var(--kiwi)] font-medium'
                  : 'text-[var(--kiwi-dark)] hover:text-[var(--kiwi)]'}`}
              >
                Mes calendriers
              </Link>
            </li>
            <li>
              <Link
                href="/create/new"
                className={`transition-colors ${isActive('/create')
                  ? 'text-[var(--kiwi)] font-medium'
                  : 'text-[var(--kiwi-dark)] hover:text-[var(--kiwi)]'}`}
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