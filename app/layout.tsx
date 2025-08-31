import type React from "react"
import type { Metadata, Viewport } from "next"
import { Raleway } from "next/font/google"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { AuthProvider } from "@/components/auth/auth-provider"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "sonner"
import { Toaster as ShadToaster } from "@/components/ui/toaster"
import "./globals.css"
import ScrollToTopOnRouteChange from "@/components/scroll-to-top"

const raleway = Raleway({ subsets: ["latin"], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Glory Home - Modern Furniture Design",
    template: "%s | Glory Home",
  },
  description: "Transforming spaces with cutting-edge furniture design and 3D visualization technology",
  keywords: [
    'glory home', 'furniture', 'interior design', '3D visualization', 'modern furniture',
    'home decor', 'custom furniture', 'Egypt furniture', 'architecture', 'visualization'
  ],
  openGraph: {
    title: "Glory Home - Modern Furniture Design",
    description: "Transforming spaces with cutting-edge furniture design and 3D visualization technology",
    url: '/',
    siteName: 'Glory Home',
    images: [
      { url: '/logo.webp', width: 512, height: 512, alt: 'Glory Home' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Glory Home - Modern Furniture Design",
    description: "Transforming spaces with cutting-edge furniture design and 3D visualization technology",
    images: ['/logo.webp'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'RoboWeb-Solutions',
  icons: {
    icon: '/icon.webp',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const supabase = createServerComponentClient({ cookies: () => cookies() })
  // const { data: { session } } = await supabase.auth.getSession()
  const session = null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Glory Home",
              "description": "Transforming spaces with cutting-edge furniture design and 3D visualization technology",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.webp`,
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Glory Home",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "inLanguage": "en",
              "publisher": {
                "@type": "Organization",
                "name": "Glory Home",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.webp`
                }
              }
            })
          }}
        />
      </head>
      <body className={raleway.className} suppressHydrationWarning={true}>
        {/* First-visit fast loader: shows once per session to improve perceived FCP */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  const KEY = 'gh_first_visit_seen';
  try {
    if (!window.sessionStorage.getItem(KEY)) {
      window.sessionStorage.setItem(KEY, '1');

      // Inline minimal CSS for instant paint (light/dark + reduced motion)
      const style = document.createElement('style');
      style.id = 'first-visit-style';
      style.textContent = '#first-visit-loader{position:fixed;inset:0;background:#ffffff;display:flex;align-items:center;justify-content:center;z-index:2147483646;transition:opacity 4s ease}#first-visit-loader.hide{opacity:0;pointer-events:none}.fv-wrap{display:flex;flex-direction:column;align-items:center;gap:14px}.fv-logo{width:84px;height:auto;filter:drop-shadow(0 1px 8px rgba(0,0,0,.06))}.fv-line{width:112px;height:3px;background:linear-gradient(90deg,#8a5a2b 0%,#e0c097 50%,#8a5a2b 100%);background-size:200% 100%;animation:fv-shine 1.1s ease-in-out infinite;border-radius:9999px}.fv-percent{font:600 12px/1.2 Raleway,system-ui,sans-serif;letter-spacing:.08em;color:#111;opacity:.85}@keyframes fv-shine{0%{background-position:200% 0}100%{background-position:-200% 0}}@media (prefers-color-scheme: dark){#first-visit-loader{background:#0a0a0a}.fv-line{background:linear-gradient(90deg,#d9b38c 0%,#f2d3a7 50%,#d9b38c 100%)}.fv-logo{filter:drop-shadow(0 1px 8px rgba(0,0,0,.3))}.fv-percent{color:#eee;opacity:.9}}@media (prefers-reduced-motion: reduce){.fv-line{animation:none}}';
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = 'first-visit-loader';
      overlay.innerHTML = '<div class="fv-wrap"><img src="/logo.webp" alt="Glory Home" class="fv-logo"/><div class="fv-line"></div><div class="fv-percent">0%</div></div>';
      document.body.appendChild(overlay);

      // percentage counter
      const pctEl = overlay.querySelector('.fv-percent');
      let pctAnimId = 0; let pctRunning = true; let lastShown = 0;
      const pctTick = () => {
        if (!pctRunning) return;
        const elapsed = Date.now() - t0;
        // Progress up to ~97% over ~1.5s, then wait for hide to finish to reach 100
        const target = Math.min(97, Math.floor(elapsed / 15));
        if (target > lastShown) {
          lastShown = target;
          if (pctEl) pctEl.textContent = target + '%';
        }
        pctAnimId = requestAnimationFrame(pctTick);
      };
      pctAnimId = requestAnimationFrame(pctTick);

      const hide = () => {
        // stop the pre-hide animation and count to 100 during fade
        pctRunning = false;
        try { cancelAnimationFrame(pctAnimId); } catch {}
        const to100 = () => {
          let val = parseInt((pctEl && pctEl.textContent) || '0', 10) || 0;
          const step = () => {
            val = Math.min(100, val + 1);
            if (pctEl) pctEl.textContent = val + '%';
            if (val < 100) setTimeout(step, 15);
          };
          step();
        };
        to100();
        overlay.classList.add('hide');
        setTimeout(() => {
          try { overlay.remove(); } catch {}
          try { style.remove(); } catch {}
        }, 4100);
      };

      // Hide around DOMContentLoaded with min dwell and max cap
      const MIN = 300; // ms
      const MAX = 2500; // ms safety cap
      const t0 = Date.now();
      const safeHide = () => {
        const elapsed = Date.now() - t0;
        const wait = Math.max(0, MIN - elapsed);
        setTimeout(hide, wait);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeHide, { once: true });
      } else {
        safeHide();
      }
      setTimeout(hide, MAX);
    }
  } catch (_) { /* fail open on any error */ }
})();`,
          }}
        />
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider session={session}>
              <ErrorBoundary>
                <ScrollToTopOnRouteChange />
                {children}
                <Toaster position="top-right" richColors />
                <ShadToaster />
              </ErrorBoundary>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
