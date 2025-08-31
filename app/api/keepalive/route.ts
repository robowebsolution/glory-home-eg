import { NextResponse } from "next/server"

// Lightweight keep-alive endpoint for Supabase
// Pings Auth and PostgREST so the project doesn't get paused.
// Schedule a daily request to this route using Vercel Cron or any external uptime service.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    return NextResponse.json(
      { ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" },
      { status: 500 }
    )
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    // 1) Auth service health
    const authRes = await fetch(`${url}/auth/v1/health`, {
      method: "GET",
      cache: "no-store",
      headers: {
        apikey: anon,
      },
      signal: controller.signal,
    })

    // 2) PostgREST touch (HEAD is cheap and sufficient)
    const restRes = await fetch(`${url}/rest/v1/`, {
      method: "HEAD",
      cache: "no-store",
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
      },
      signal: controller.signal,
    })

    const result = {
      ok: authRes.ok && restRes.ok,
      auth: { status: authRes.status },
      rest: { status: restRes.status },
      at: new Date().toISOString(),
    }

    return NextResponse.json(result, { status: result.ok ? 200 : 207 })
  } catch (err: any) {
    const message = err?.name === "AbortError" ? "timeout" : (err?.message || "unknown error")
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  } finally {
    clearTimeout(timeout)
  }
}
