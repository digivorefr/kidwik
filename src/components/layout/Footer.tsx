import Link from 'next/link'

function Footer() {
  return (
    <footer className="bg-white shadow-2xl text-gray-500 p-6">
      <div className="container mx-auto">
        <div className="mb-2">
          <p>© {new Date().getFullYear()} kidwik - Tous droits réservés</p>
        </div>
        
        <div className="flex gap-4 mt-2 text-sm">
          <Link 
            href="/about" 
            className="text-gray-500 hover:text-[var(--kiwi)] transition-colors"
          >
            À propos
          </Link>
          <Link 
            href="/legal" 
            className="text-gray-500 hover:text-[var(--kiwi)] transition-colors"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer