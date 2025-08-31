/*import { redirect } from "next/navigation";
import ProfileClientPage from "./ProfileClientPage";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/profile");
  }

  return <ProfileClientPage user={user} />;
}
*/