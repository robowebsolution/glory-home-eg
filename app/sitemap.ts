import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^\u0600-\u06FF\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

async function getBaseUrl() {
  const h = await headers()
  const envBase = process.env.NEXT_PUBLIC_SITE_URL
  if (envBase) return envBase.replace(/\/$/, '')
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const protoHeader = h.get('x-forwarded-proto')
  const proto = protoHeader ?? (host.includes('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getBaseUrl()
  const now = new Date()

  const urls = new Set<string>([
    '/',
    '/about',
    '/projects',
    '/categories',
    '/contact',
    '/love',
  ])

  try {
    // Commerce categories
    const catRes = await fetch(`${base}/api/categories`, { next: { revalidate: 1800 } })
    if (catRes.ok) {
      const cats = await catRes.json()
      if (Array.isArray(cats)) {
        for (const c of cats) {
          if (c?.slug) urls.add(`/categories/${c.slug}`)
        }
      }
    }
  } catch {}

  try {
    // Project categories
    const pcRes = await fetch(`${base}/api/project-categories`, { next: { revalidate: 1800 } })
    if (pcRes.ok) {
      const data = await pcRes.json()
      const cats = data?.categories || []
      for (const c of cats) {
        const slug = slugify(c?.name_en || '')
        if (slug) urls.add(`/projects/category/${slug}`)
      }
    }
  } catch {}

  try {
    // Products (cap to 50 to keep sitemap lean)
    const prodRes = await fetch(`${base}/api/products?limit=50`, { next: { revalidate: 1800 } })
    if (prodRes.ok) {
      const prods = await prodRes.json()
      if (Array.isArray(prods)) {
        for (const p of prods) {
          if (p?.id) urls.add(`/products/${p.id}`)
        }
      }
    }
  } catch {}

  return Array.from(urls).map((path): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
