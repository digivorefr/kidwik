import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mes calendriers | Consultez et gérez vos calendriers personnalisés',
  description: 'Visualisez et gérez vos calendriers hebdomadaires pour enfants. Exportez, modifiez ou créez de nouveaux calendriers personnalisés pour faciliter la routine de votre enfant.',
  alternates: {
    canonical: '/view',
  },
  openGraph: {
    title: 'kidwik - Mes calendriers personnalisés',
    description: 'Visualisez et gérez vos calendriers hebdomadaires pour enfants. Exportez, modifiez ou créez de nouveaux calendriers personnalisés.',
    url: '/view',
  }
}

export default function ViewLayout({
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