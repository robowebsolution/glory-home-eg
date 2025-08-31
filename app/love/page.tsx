import { redirect } from "next/navigation";
import LoveClientPage from "./LoveClientPage";
import { createClient } from "@/lib/supabase-server";

export default async function LovePage() {
 
   
  return <LoveClientPage  />;
}
