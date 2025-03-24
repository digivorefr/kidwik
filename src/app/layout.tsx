import './globals.css'
import './tailwind-safelist.css'
import type { Metadata } from 'next'
import { Poppins, Itim, Playwrite_IT_Moderna } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider'

// Polices Google
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

const itim = Itim({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-itim',
})

// Polices locales
const playwriteITModerna = Playwrite_IT_Moderna({
  variable: "--font-playwrite-it-moderna",
  weight: ["400"],
});

// Métadonnées par défaut (fallback)
export const metadata: Metadata = {
  metadataBase: new URL('https://kidwik.fr'),
  title: {
    template: '%s | kidwik',
    default: 'kidwik - Calendriers personnalisés pour enfants',
  },
  description: 'Créez et personnalisez des calendriers hebdomadaires adaptés aux enfants. Un outil éducatif pour aider au développement de la routine et de l\'autonomie.',
  keywords: ['calendrier enfant', 'calendrier personnalisé', 'routine enfant', 'outil éducatif', 'planification visuelle'],
  authors: [{ name: 'kidwik' }],
  creator: 'kidwik',
  publisher: 'kidwik',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'kidwik',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'kidwik - Calendriers personnalisés pour enfants',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kidwik - Calendriers personnalisés pour enfants',
    description: 'Créez et personnalisez des calendriers hebdomadaires adaptés aux enfants. Un outil éducatif pour aider au développement de la routine et de l\'autonomie.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${poppins.variable} ${itim.variable} ${playwriteITModerna.variable}`}>
      <body>
        <ReactQueryProvider>
          <Header />
          <main className="flex min-h-screen flex-col items-center pb-20">
            {children}
          </main>
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
