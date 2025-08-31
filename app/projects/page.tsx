import type { Metadata } from 'next'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import ProjectsClient from "@/components/projects/ProjectsClient"
import { headers } from "next/headers"

type Category = { id: number; name_en: string; name_ar: string; slug: string }

export const metadata: Metadata = {
  title: "Projects | Glory Home",
  description: "Explore our latest interior design and furniture visualization projects across categories.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Glory Home",
    description: "Explore our latest interior design and furniture visualization projects across categories.",
    images: [{ url: "/logo.webp", width: 1200, height: 630, alt: "Glory Home" }],
  },
}
type Project = {
  id: number
  name_en: string
  name_ar: string
  description_en?: string | null
  description_ar?: string | null
  category_id: number
  cover: string | null
  images: string[]
}

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

async function getData() {
  const base = await getBaseUrl()
  const [catsRes, projsRes] = await Promise.all([
    fetch(`${base}/api/project-categories`, {
      next: { revalidate: 600, tags: ["project-categories"] },
    }),
    fetch(`${base}/api/projects?limit=50`, {
      next: { revalidate: 600, tags: ["projects"] },
    }),
  ])

  const catsJson = await catsRes.json()
  const projsJson = await projsRes.json()

  const categories: Category[] = (catsJson.categories || []).map((c: any) => ({
    ...c,
    slug: slugify(c.name_en || ""),
  }))
  const projects: Project[] = (projsJson.projects || [])

  return { categories, projects }
}

export default async function ProjectsPage() {
  const { categories, projects } = await getData()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <ProjectsClient categories={categories} projects={projects} />
      <Footer />
    </div>
  )
}
