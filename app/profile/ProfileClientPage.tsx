/*"use client";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProfileClientPageProps {
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

export default function ProfileClientPage({ user }: ProfileClientPageProps) {
  const { t, language, isRTL } = useLanguage();
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 min-h-[60vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`mb-12 text-center ${isRTL ? "rtl" : ""}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("profile.title") || "My Profile"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t("profile.subtitle") || "Manage your account information and preferences."}
          </p>
        </motion.div>
        <Card className="rounded-xl shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl text-gray-400 dark:text-gray-500">👤</span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{user.full_name || user.email}</h3>
            <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
          
            <div className="mt-4 w-full grid grid-cols-1 gap-2 text-sm text-gray-700 dark:text-gray-300">
              <div><b>{t("profile.id") || "User ID"}:</b> {user.id}</div>
         
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
*/