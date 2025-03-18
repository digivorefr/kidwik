import Link from 'next/link';
import { FadeIn } from '@/components/ui/motion';
import EmailProtection from '@/components/ui/EmailProtection';

export default function LegalPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <FadeIn>
        <h1 className="text-4xl font-bold text-[var(--kiwi-darker)] mb-8 text-center">
          Mentions légales
        </h1>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              1. Éditeur du site
            </h2>
            <p className="text-lg">
              Le site KidWik est édité par :
            </p>
            <div className="pl-4 border-l-4 border-[var(--kiwi-light)] py-2">
              <p><strong>Digivore</strong></p>
              <p>6 place du castelat</p>
              <p>31460 Caraman</p>
              <p>SIREN : 123 456 789</p>
              <p>Email : <EmailProtection emailUser="hello" emailDomain="kidwik.fr" /></p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              2. Hébergement
            </h2>
            <p className="text-lg">
              L&apos;hébergement du site est assuré par :
            </p>
            <div className="pl-4 border-l-4 border-[var(--kiwi-light)] py-2">
              <p><strong>Vercel, Inc.</strong></p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789</p>
              <p>États-Unis</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              3. Propriété intellectuelle
            </h2>
            <p className="text-lg">
              L&apos;ensemble du contenu du site KidWik (interface, code, textes, images, logos) est la propriété 
              exclusive de Digivore, à l&apos;exception des éléments fournis par des tiers.
            </p>
            <p className="text-lg">
              Le code source de KidWik est publié sous licence MIT, ce qui permet sa réutilisation 
              sous certaines conditions détaillées dans le fichier de licence disponible sur notre 
              dépôt GitHub.
            </p>
            <p className="text-lg">
              Les typographies utilisées sont fournies par Google Fonts, selon leurs propres 
              conditions d&apos;utilisation.
            </p>
            <p className="text-lg">
              Toute reproduction, représentation, modification, publication, adaptation de tout ou 
              partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est 
              interdite, sauf autorisation écrite préalable de Digivore ou conformément aux termes 
              de la licence MIT pour le code source.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              4. Données personnelles et confidentialité
            </h2>
            <p className="text-lg">
              KidWik est conçu dans le respect de votre vie privée.
            </p>
            <p className="text-lg">
              L&apos;application n&apos;effectue aucune collecte de données personnelles. Toutes les données 
              que vous créez dans l&apos;application (calendriers, préférences, etc.) sont stockées 
              exclusivement sur votre appareil et ne sont jamais transmises à des serveurs externes.
            </p>
            <p className="text-lg">
              Aucun cookie ou traceur n&apos;est utilisé sur ce site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              5. Loi applicable et juridiction
            </h2>
            <p className="text-lg">
              Les présentes mentions légales sont soumises au droit français. En cas de litige, 
              les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[var(--kiwi-dark)] mb-4">
              6. Contact
            </h2>
            <p className="text-lg">
              Pour toute question relative à ces mentions légales, vous pouvez nous contacter 
              à l&apos;adresse suivante : <EmailProtection emailUser="hello" emailDomain="kidwik.fr" />
            </p>
          </section>
        </div>
      </FadeIn>
    </main>
  );
}