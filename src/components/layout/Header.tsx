import Link from 'next/link'

function Header() {
  return (
    <header className="bg-[var(--kiwi-dark)] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">KidWik</Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link href="/about" className="hover:text-[var(--kiwi-light)]">
                À propos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header