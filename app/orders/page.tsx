/*
"use client"
import { redirect } from "next/navigation";
import OrdersClientPage from "./OrdersClientPage";
import { useAuth } from "@/components/auth/auth-provider"

export default function OrdersPage() {
  const { user, loading } = useAuth();
  
  // Don't redirect while auth is still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Only redirect after auth has loaded and there's no user
  if (!loading && !user) {
    redirect("/auth/signin?next=/orders");
  }
  
  // At this point, user is guaranteed to exist
  return <OrdersClientPage userId={user!.id} />;
}
*/
