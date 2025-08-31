"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Page Not <span className="font-bold">Found</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 group">
                <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Go Home
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => window.history.back()} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
