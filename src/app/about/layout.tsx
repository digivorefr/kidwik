import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos | kidwik - Calendriers visuels pour enfants',
  description: 'Découvrez kidwik, une application dédiée à la création de calendriers visuels personnalisés pour faciliter la compréhension des routines par les enfants.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'À propos de kidwik - Calendriers visuels pour enfants',
    description: 'Découvrez l\'histoire et la mission de kidwik, une application conçue pour aider les enfants à mieux comprendre leurs routines quotidiennes grâce à des calendriers visuels.',
    url: '/about',
  }
}

export default function AboutLayout({
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