import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nouveau calendrier | Commencez votre calendrier personnalisé',
  description: 'Créez un nouveau calendrier pour votre enfant. Première étape pour créer un outil visuel qui aidera votre enfant à comprendre sa routine quotidienne.',
  alternates: {
    canonical: '/create/new',
  },
  openGraph: {
    title: 'kidwik - Commencez un nouveau calendrier personnalisé',
    description: 'Créez un nouveau calendrier personnalisé pour votre enfant. Aidez-le à suivre sa routine quotidienne avec un support visuel adapté.',
    url: '/create/new',
  }
}

export default function NewCalendarLayout({
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