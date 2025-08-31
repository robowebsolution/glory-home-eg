import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Glory Home',
  description: 'Learn about Glory Home, our mission, values, and expertise in modern furniture design and 3D visualization.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us | Glory Home',
    description: 'Learn about Glory Home, our mission, values, and expertise in modern furniture design and 3D visualization.',
    images: [{ url: '/logo.webp', width: 1200, height: 630, alt: 'Glory Home' }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
