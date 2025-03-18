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
                href="/create/new" 
                className="btn-primary px-6 py-3 rounded-lg text-center font-medium"
              >
                Créer mon calendrier
              </Link>
              <Link 
                href="/view" 
                className="px-6 py-3 rounded-lg text-center border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium"
              >
                Mes calendriers
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

      {/* Features section */}
      <section className="container mx-auto p-8 mb-12">
        <h2 className="text-2xl font-bold text-[var(--kiwi-darker)] mb-6 text-center">
          Fonctionnalités
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-[var(--kiwi-darker)]">Personnalisable</h3>
            <p>Choisissez les jours, les activités et les couleurs selon vos besoins.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-[var(--kiwi-darker)]">Imprimable</h3>
            <p>Exportez en PDF pour imprimer facilement votre calendrier et vos gommettes.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-[var(--kiwi-darker)]">Sauvegardable</h3>
            <p>Enregistrez vos calendriers localement et importez/exportez-les facilement.</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/create/new" 
            className="btn-primary px-6 py-3 rounded-lg text-center font-medium inline-block"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>
    </>
  )
}
