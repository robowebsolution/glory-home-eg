import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categories | Glory Home',
  description: 'Browse product categories at Glory Home to find modern furniture and decor that match your style.',
  alternates: { canonical: '/categories' },
  openGraph: {
    title: 'Categories | Glory Home',
    description: 'Browse product categories at Glory Home to find modern furniture and decor that match your style.',
    images: [{ url: '/logo.webp', width: 1200, height: 630, alt: 'Glory Home' }],
  },
}

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children
}
