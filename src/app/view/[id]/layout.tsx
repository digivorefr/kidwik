import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendrier | kidwik - Visualisation de votre calendrier personnalisé',
  description: 'Visualisez et gérez votre calendrier personnalisé pour enfant. Un support visuel adapté pour aider votre enfant à comprendre sa routine quotidienne.',
  openGraph: {
    title: 'kidwik - Votre calendrier personnalisé',
    description: 'Visualisez en détail votre calendrier personnalisé pour enfant. Imprimez-le ou modifiez-le facilement selon vos besoins.',
  },
  robots: {
    index: false,
    follow: true
  }
}

export default function CalendarDetailLayout({
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