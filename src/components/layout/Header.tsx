'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-xl shadow-black/4 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className={`text-2xl font-bold text-[var(--kiwi-medium)]`}
        >
          <Image src="/kidwik-logo.svg" alt="kidwik" width={100} height={100} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
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

        {/* Mobile Burger Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 z-20"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <motion.span
            className="w-6 h-0.5 bg-[var(--kiwi-dark)]"
            animate={{
              rotate: isMenuOpen ? 45 : 0,
              y: isMenuOpen ? 8 : 0
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-[var(--kiwi-dark)]"
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-[var(--kiwi-dark)]"
            animate={{
              rotate: isMenuOpen ? -45 : 0,
              y: isMenuOpen ? -8 : 0
            }}
            transition={{ duration: 0.2 }}
          />
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-white z-10 md:hidden pt-20"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <nav className="container mx-auto px-6">
                <ul className="flex flex-col gap-6">
                  <li>
                    <Link
                      href="/view"
                      onClick={closeMenu}
                      className={`text-xl transition-colors ${isActive('/view')
                        ? 'text-[var(--kiwi)] font-medium'
                        : 'text-[var(--kiwi-dark)]'}`}
                    >
                      Mes calendriers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/create/new"
                      onClick={closeMenu}
                      className={`text-xl transition-colors ${isActive('/create')
                        ? 'text-[var(--kiwi)] font-medium'
                        : 'text-[var(--kiwi-dark)]'}`}
                    >
                      Créer un calendrier
                    </Link>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header