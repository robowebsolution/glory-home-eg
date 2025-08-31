"use client";
import { useEffect, useState } from "react";
import { getUserOrders, cancelOrder, deleteOrder } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {  useLanguage } from "@/lib/language-context";
import { Loader2, AlertTriangle } from "lucide-react";
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

interface OrdersClientPageProps {
  userId: string;
}

export default function OrdersClientPage({ userId }: OrdersClientPageProps) {
  const { t, language, isRTL } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh orders
  const refreshOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserOrders(userId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(t("orders.error") || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserOrders(userId);
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(t("orders.error") || "Error loading orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
    console.log(userId);
  }, [userId]);

  // Assuming there's a context or prop update that triggers this after a purchase
  // Replace 'newOrderPlaced' with the actual dependency
  const [newOrderPlaced, setNewOrderPlaced] = useState(false);
  useEffect(() => {
    refreshOrders();
  }, [newOrderPlaced]);

  // Function to handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      refreshOrders();
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  // Function to handle order deletion
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      refreshOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

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
        <AlertTriangle className="h-8 w-8 text-yellow-500 mb-3" />
        <span className="text-lg text-yellow-700 dark:text-yellow-400">{error}</span>
      </section>
    );
  }

  console.log("Fetched orders:", orders);

  const translationKeys = [
    "orders.title",
    "orders.subtitle",
    "orders.empty",
    "orders.orderId",
    "orders.status",
    "orders.total",
    "orders.items",
    "orders.payment",
    "orders.error"
  ];

  translationKeys.forEach(key => {
    if (!t(key)) {
      console.warn(`Missing translation key: ${key}`);
    }
  });

  return (
    <>
      <Navigation />
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900 min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`mb-12 text-center ${isRTL ? "rtl" : ""}`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t("orders.title") || "My Orders"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("orders.subtitle") || "View all your recent orders and their status."}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {orders.length === 0 ? (
              <div className="col-span-2 text-center text-gray-500 dark:text-gray-400">
                {t("orders.empty") || "You have no orders yet."}
                {console.warn("No orders found for user.")}
              </div>
            ) : (
              orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <Card className="rounded-xl shadow-lg border-0 bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                          <span className="text-base font-semibold text-primary">{t("orders.orderId") || "Order #"}{order.id}</span>
                          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {t(`orders.status.${order.status}`) || order.status}
                          </span>
                          <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString(language)}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
                          <span>{t("orders.total") || "Total"}: <b>${order.total_amount}</b></span>
                          <span>{t("orders.items") || "Items"}: <b>{order.items?.length || 0}</b></span>
                          <span>{t("orders.payment") || "Payment"}: <b>{order.payment_status}</b></span>
                        </div>
                        {/* Order actions */}
                        <div className="flex gap-2 mt-4">
                          <Button onClick={() => handleCancelOrder(order.id)} variant="outline" className="text-red-600">
                            {t("orders.cancel") || "Cancel"}
                          </Button>
                          <Button onClick={() => handleDeleteOrder(order.id)} variant="outline" className="text-red-600">
                            {t("orders.delete") || "Delete"}
                          </Button>
                        </div>
                        {/* تفاصيل المنتجات في الطلب */}
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">{t("orders.products") || "Products"}:</h4>
                          <ul className="space-y-2">
                            {order.items?.map((item: any) => {
                              // Get product image with fallback
                              const productImage = item.product?.main_image || item.product?.image_url || "/placeholder.svg";
                              return (
                                <li key={item.id} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                  <img 
                                    src={productImage} 
                                    alt={item.product_name} 
                                    className="w-12 h-12 object-cover rounded-md"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "/placeholder.svg";
                                    }}
                                  />
                                  <div>
                                    <span>{item.product_name}</span> <span className="text-xs text-gray-500">x{item.quantity}</span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
