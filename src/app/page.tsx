import type { Metadata } from 'next'
import { FadeIn, ScaleIn } from '@/components/ui/motion'
import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Créez facilement des calendriers visuels pour enfants | kidwik',
  description: 'kidwik vous permet de créer facilement des calendriers hebdomadaires personnalisés pour enfants. Aidez votre enfant à se repérer dans le temps avec un outil ludique et éducatif.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Créez facilement des calendriers visuels pour enfants | kidwik',
    description: 'Créez des calendriers hebdomadaires personnalisés pour enfants avec kidwik. Un outil ludique et éducatif pour aider les enfants à se repérer dans le temps.',
    url: '/',
  }
}

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow container mx-auto py-8 min-h-[50dvh] flex flex-col md:flex-row items-center gap-12">
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
              <ButtonLink
                href="/create/new"
                variant="primary"
                size="lg"
              >
                Créer mon calendrier
              </ButtonLink>
              <ButtonLink
                href="/view"
                variant="outline"
                size="lg"
              >
                Mes calendriers
              </ButtonLink>
            </div>
          </FadeIn>
        </div>

        {/* Right side: Illustration */}
        <div className="md:w-1/2">
          <ScaleIn>
            <Image
              src="/home.webp"
              alt="Illustration du calendrier"
              width={500}
              height={500}
              className="rounded-lg w-full"
            />
          </ScaleIn>
        </div>
      </main>

      {/* Features section */}
      <section className="container mx-auto py-8 mb-12">
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
          <ButtonLink
            href="/create/new"
            variant="primary"
            size="lg"
          >
            Commencer maintenant
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
