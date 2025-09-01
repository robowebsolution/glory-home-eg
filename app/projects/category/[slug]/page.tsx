import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import CategoryClient from "@/components/projects/CategoryClient"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import type { Metadata } from 'next'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

async function getBaseUrl() {
  const h = await headers()
  const envBase = process.env.NEXT_PUBLIC_SITE_URL
  if (envBase) return envBase.replace(/\/$/, "")
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const protoHeader = h.get("x-forwarded-proto")
  const proto = protoHeader ?? (host.includes("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

async function getData(slug: string) {
  const base = await getBaseUrl()
  const catsRes = await fetch(`${base}/api/project-categories`, {
    next: { revalidate: 600, tags: ["project-categories"] },
  })
  const catsJson = await catsRes.json()
  const categories = (catsJson.categories || []).map((c: any) => ({
    ...c,
    slug: slugify(c.name_en || ""),
  }))

  const category = categories.find((c: any) => c.slug === slug)
  if (!category) return { category: null, projects: [] }

  const projsRes = await fetch(`${base}/api/projects?category_id=${category.id}&limit=60`, {
    next: { revalidate: 600, tags: [`projects-category-${category.id}`] },
  })
  const projsJson = await projsRes.json()
  const projects = projsJson.projects || []

  return { category, projects }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { category } = await getData(slug)

  if (!category) {
    return {
      title: 'Category Not Found | Glory Home',
      description: 'We could not find the requested project category.',
      robots: { index: false, follow: false },
    }
  }

  const title = `${category.name_en || 'Projects'} | Glory Home`
  const description = category.description_en || 'Explore projects in this category.'

  return {
    title,
    description,
    alternates: { canonical: `/projects/category/${slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: '/logo.webp', width: 1200, height: 630, alt: 'Glory Home' }],
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { category, projects } = await getData(slug)

  if (!category) return notFound()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <CategoryClient category={category} projects={projects} />
      <Footer />
    </div>
  )
}
