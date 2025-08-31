"use client";
import { useEffect, useState } from "react";
import { getUserWishlist } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { useLanguage } from "@/lib/language-context";
import { Loader2, HeartOff } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase-client";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

interface LoveClientPageProps {
  userId: string;
}

export default function LoveClientPage() {
  const { t, language, isRTL } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function loadWishlist() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserWishlist(user.id);
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(t("love.error"));
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [user]);

  if (loading) {
    return (
      <section className="py-16 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <HeartOff className="h-8 w-8 text-pink-400 mb-3" />
        <span className="text-lg text-pink-700 dark:text-pink-400">{error}</span>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 min-h-[60vh]">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`mb-12 text-center ${isRTL ? "rtl" : ""}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("love.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("love.subtitle")}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <div className="col-span-4 text-center text-gray-500 dark:text-gray-400">
              {t("love.empty")}
            </div>
          ) : (
            products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </section>
  );
}
