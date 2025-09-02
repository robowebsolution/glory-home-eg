"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import type { Product } from "@/lib/supabase"
import Link from "next/link"
import { motion } from "framer-motion"
import ImageWithSkeleton from "@/components/ui/image-with-skeleton"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  // استخدم main_image أو fallback إلى image_url أو placeholder
  const productImage = product.main_image || "/placeholder.svg"

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`} className="block group">
        <Card className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-800/80 dark:bg-gray-900/50">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative overflow-hidden">
                <ImageWithSkeleton
                  src={productImage}
                  alt={product.name}
                  className="w-full h-64 md:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  wrapperClassName="w-full h-64 md:h-48"
                  loading="lazy"
                />
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>

              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                  {/* Specifications */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(product.specifications)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <span key={key} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {key}: {String(value)}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  {product.price != null && (
                    <div className="flex items-baseline gap-2">
                      {product.sale_price != null && product.sale_price < product.price ? (
                        <>
                          <span className="text-2xl font-bold text-primary">EGP {product.sale_price.toLocaleString()}</span>
                          <span className="text-lg text-gray-500 line-through">EGP {product.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">EGP {product.price.toLocaleString()}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="p-2 bg-transparent" aria-label="Add to wishlist">
                      <Heart className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2 bg-transparent" aria-label="Preview product">
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button size="sm" className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  // Grid View
  return (
    <Link href={`/products/${product.id}`} className="block group h-full">
      <Card className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-800/80 dark:bg-gray-900/50 h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="relative overflow-hidden aspect-square w-full">
            <ImageWithSkeleton
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              wrapperClassName="w-full h-full"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                Featured
              </div>
            )}

            {/* Hover Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-3 right-3 flex-col gap-2 hidden group-hover:flex"
            >
              <Button size="icon" variant="secondary" className="w-9 h-9 p-0 bg-white/90 hover:bg-white rounded-full shadow-md" aria-label="Add to wishlist">
                <Heart className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="icon" variant="secondary" className="w-9 h-9 p-0 bg-white/90 hover:bg-white rounded-full shadow-md" aria-label="Preview product">
                <Eye className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>

          <div className="p-4 bg-white flex flex-col flex-grow">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              {product.price != null && (
                <div className="flex items-baseline gap-2">
                  {product.sale_price != null && product.sale_price < product.price ? (
                    <>
                      <span className="text-xl font-bold text-primary">EGP {product.sale_price.toLocaleString()}</span>
                      <span className="text-md text-gray-500 line-through">EGP {product.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">EGP {product.price.toLocaleString()}</span>
                  )}
                </div>
              )}
              {product.in_stock ? (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">In Stock</span>
              ) : (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">Out of Stock</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}