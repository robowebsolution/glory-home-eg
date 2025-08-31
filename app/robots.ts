import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

async function getBaseUrl() {
  const h = await headers()
  const envBase = process.env.NEXT_PUBLIC_SITE_URL
  if (envBase) return envBase.replace(/\/$/, '')
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const protoHeader = h.get('x-forwarded-proto')
  const proto = protoHeader ?? (host.includes('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getBaseUrl()
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
