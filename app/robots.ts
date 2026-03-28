import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = getSiteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/orders',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
