import Link from 'next/link'
import { FadeIn, ScaleIn } from '@/components/ui/motion'

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow container mx-auto p-8 flex flex-col md:flex-row items-center gap-12">
        {/* Left side: Text content */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--kiwi-darker)]">
              Calendrier visuel personnalisable pour enfants
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <p className="text-lg">
              Créez et imprimez un calendrier hebdomadaire personnalisé avec des gommettes 
              détachables pour aider les enfants à se repérer dans le temps.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/create" 
                className="btn-primary px-6 py-3 rounded-lg text-center font-medium"
              >
                Créer mon calendrier
              </Link>
              <Link 
                href="/examples" 
                className="px-6 py-3 rounded-lg text-center border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium"
              >
                Voir des exemples
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Right side: Illustration */}
        <div className="md:w-1/2">
          <ScaleIn>
            <div className="bg-[var(--kiwi-light)] rounded-lg p-4 h-80 flex items-center justify-center">
              <p className="text-lg font-medium text-[var(--kiwi-darker)]">Illustration du calendrier</p>
            </div>
          </ScaleIn>
        </div>
      </main>

      {/* Saved calendars section (conditionally rendered) */}
      <section id="saved-calendars" className="container mx-auto p-8 mb-12">
        <h2 className="text-2xl font-bold text-[var(--kiwi-darker)] mb-6">Mes calendriers sauvegardés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* This will be populated dynamically */}
        </div>
      </section>
    </>
  )
}
