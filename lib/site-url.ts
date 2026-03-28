const DEFAULT_SITE_URL = 'https://www.gloryhome-eg.com'
type HeadersLike = {
  get(name: string): string | null
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
}

export function getRequestSiteUrl(headers: HeadersLike) {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL
  if (envBase) return envBase.replace(/\/$/, '')

  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  if (!host) return DEFAULT_SITE_URL

  const protoHeader = headers.get('x-forwarded-proto')
  const proto = protoHeader ?? (host.includes('localhost') ? 'http' : 'https')
  return `${proto}://${host}`.replace(/\/$/, '')
}
