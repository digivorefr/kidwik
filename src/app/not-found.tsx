import { Metadata } from 'next'
import Link from 'next/link';
import { FadeIn } from '@/components/ui/motion';

export const metadata: Metadata = {
  title: 'Page non trouvée | kidwik',
  description: 'La page que vous recherchez n\'existe pas ou a été déplacée. Revenez à l\'accueil pour continuer à utiliser kidwik.',
  robots: {
    index: false,
    follow: true,
  }
}

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
      <FadeIn>
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-[var(--kiwi-darker)] text-6xl font-bold mb-6">
            404
          </h1>
          <div className="mb-8">
            <h2 className="text-[var(--kiwi-dark)] text-3xl font-semibold mb-4">
              Page introuvable
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Oups ! Cette page semble s&apos;être égarée comme un petit sticker mal placé sur un calendrier.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[var(--kiwi)] text-white font-medium rounded-lg hover:bg-[var(--kiwi-dark)] transition-colors"
          >
            Retourner à l&apos;accueil
          </Link>
        </div>
      </FadeIn>
    </main>
  );
}