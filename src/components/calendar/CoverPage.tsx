'use client';

import { cn } from '@/lib/utils/cn';
import { ThemeClasses } from './types';

interface CoverPageProps {
  themeClasses: ThemeClasses;
}

function CoverPage({ themeClasses }: CoverPageProps) {
  const headerColorClass = themeClasses?.titleColor || 'bg-green-600';

  return (
    <div id="cover-page" className="cover-page w-full h-full bg-white p-8 flex flex-col">
      <div className={cn(themeClasses?.headerBg ?? 'bg-green-600', 'rounded-lg p-4 text-center mb-6')}>
        <h3 className="text-2xl text-white">
          Mode d&apos;emploi du calendrier
        </h3>
      </div>
      
      <div className="flex-grow flex flex-col space-y-6">
        <section>
          <h2 className={cn(headerColorClass, 'text-xl font-semibold mb-2')}>
            1. Impression
          </h2>
          <p className="text-gray-700">
            Imprimez ce document sur du papier épais (120-160g/m²) pour une meilleure durabilité.
            Si vous ne disposez pas de papier épais, vous pouvez plastifier le calendrier et 
            les gommettes après impression pour les protéger.
          </p>
        </section>
        
        <section>
          <h2 className={cn(headerColorClass, 'text-xl font-semibold mb-2')}>
            2. Préparation des gommettes
          </h2>
          <p className="text-gray-700">
            Découpez soigneusement les gommettes le long des bordures. Si vous n&apos;avez pas plastifié
            l&apos;ensemble du document, vous pouvez protéger chaque gommette avec du ruban adhésif
            transparent ou avec des pochettes de plastification.
          </p>
        </section>
        
        <section>
          <h2 className={cn(headerColorClass, 'text-xl font-semibold mb-2')}>
            3. Système de fixation
          </h2>
          <p className="text-gray-700 mb-2">
            Choisissez l&apos;une des méthodes suivantes pour fixer les gommettes au calendrier
            de façon à ce qu&apos;elles soient repositionnables :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>
              <span className="font-medium">Velcro autocollant</span> : Fixez de petits morceaux de Velcro
              au dos des gommettes et aux emplacements du calendrier.
            </li>
            <li>
              <span className="font-medium">Patafix</span> : Utilisez de petites boulettes de Patafix 
              pour fixer les gommettes de façon non permanente.
            </li>
            <li>
              <span className="font-medium">Aimants</span> : Si vous affichez le calendrier sur une surface
              métallique, collez de petits aimants au dos des gommettes.
            </li>
            <li>
              <span className="font-medium">Scotch double-face repositionnable</span> : Placez de petits
              morceaux au dos des gommettes.
            </li>
          </ul>
        </section>
        
        <section>
          <h2 className={cn(headerColorClass, 'text-xl font-semibold mb-2')}>
            4. Utilisation avec l&apos;enfant
          </h2>
          <p className="text-gray-700">
            Affichez le calendrier à hauteur de l&apos;enfant pour qu&apos;il puisse l&apos;atteindre facilement.
            Prenez un moment chaque début de semaine pour planifier ensemble les activités à venir.
            Laissez l&apos;enfant participer au placement des gommettes pour favoriser son autonomie et
            sa compréhension du temps.
          </p>
        </section>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        Bon planning avec KidWik !
      </div>
    </div>
  );
}

export default CoverPage;