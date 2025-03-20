import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales | kidwik - Calendriers pour enfants',
  description: 'Consultez les mentions légales, politique de confidentialité et conditions d\'utilisation de kidwik, l\'application de création de calendriers visuels pour enfants.',
  alternates: {
    canonical: '/legal',
  },
  openGraph: {
    title: 'Mentions légales | kidwik - Calendriers pour enfants',
    description: 'Informations légales concernant l\'utilisation de kidwik, l\'application de création de calendriers visuels personnalisés pour enfants.',
    url: '/legal',
  }
}

export default function LegalLayout({
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