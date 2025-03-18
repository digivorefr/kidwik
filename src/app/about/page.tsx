import Link from 'next/link';
import { FadeIn } from '@/components/ui/motion';
import EmailProtection from '@/components/ui/EmailProtection';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <FadeIn>
        <h1 className="text-4xl font-bold text-[var(--kiwi-darker)] mb-8 text-center">
          À propos de kidwik
        </h1>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              Notre mission
            </h2>
            <p className="text-lg">
              kidwik a été conçu pour aider les enfants à mieux se repérer dans le temps grâce à un calendrier 
              visuel personnalisable et des gommettes représentant différentes activités quotidiennes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              Qui sommes-nous ?
            </h2>
            <p className="text-lg">
              L&apos;application a été conçue par Pierre Bonnin et Sophie Tournière dans un but non lucratif.
              Notre objectif est de fournir un outil pratique et gratuit aux familles et professionnels
              travaillant avec des enfants.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              Open Source
            </h2>
            <p className="text-lg">
              Le code de kidwik est entièrement open source, publié sous licence MIT, et disponible sur GitHub.
              Cela signifie que vous pouvez consulter, modifier et contribuer au code librement.
            </p>
            <div className="mt-4">
              <Link
                href="https://github.com/digivorefr/kidwik"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[var(--kiwi-light)] text-[var(--kiwi-darker)] rounded-lg hover:bg-[var(--kiwi)] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Voir le code source
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              Confidentialité
            </h2>
            <p className="text-lg">
              Nous respectons entièrement votre vie privée. kidwik n&apos;effectue aucun tracking et ne synchronise 
              aucune donnée avec un serveur externe. Toutes les données que vous créez (calendriers, 
              préférences, etc.) restent exclusivement stockées sur votre appareil et ne sont jamais exploitées.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              Contactez-nous
            </h2>
            <p className="text-lg">
              Tous vos retours sont les bienvenus ! Pour nous faire part de vos suggestions, signaler un 
              problème ou simplement nous dire bonjour, écrivez-nous à : <EmailProtection emailUser="hello" emailDomain="kidwik.fr" />
            </p>
          </section>
        </div>
      </FadeIn>
    </main>
  );
}