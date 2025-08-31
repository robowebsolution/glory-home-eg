import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required form fields." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, message }])
    .select();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to save message to the database." },
      { status: 500 }
    );
  }

  // Optionally, you could add an email notification service here (e.g., Resend, SendGrid)

  return NextResponse.json(
    { message: "Message submitted successfully!", data },
    { status: 200 }
  );
}
