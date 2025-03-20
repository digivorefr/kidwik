import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Création de calendrier | Personnalisez un calendrier pour votre enfant',
  description: 'Créez et personnalisez un calendrier visuel adapté aux besoins de votre enfant. Choisissez le thème, les activités et ajoutez une photo pour un calendrier unique.',
  alternates: {
    canonical: '/create',
  },
  openGraph: {
    title: 'kidwik - Créez un calendrier personnalisé pour votre enfant',
    description: 'Notre éditeur intuitif vous permet de créer un calendrier visuel adapté aux besoins de votre enfant. Personnalisez couleurs, activités et ajoutez des photos.',
    url: '/create',
  },
  robots: {
    index: false,
    follow: true
  }
}

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}