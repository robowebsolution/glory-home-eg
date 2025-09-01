import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

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

  // Send email notification to Gmail using Nodemailer (Gmail SMTP)
  try {
    const forwardTo = process.env.CONTACT_FORWARD_TO_EMAIL;
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD; // Use App Password if 2FA is enabled
    const fromEmail = process.env.GMAIL_FROM_EMAIL || gmailUser;

    if (!forwardTo || !gmailUser || !gmailAppPassword) {
      console.warn(
        "Email forwarding skipped: missing CONTACT_FORWARD_TO_EMAIL, GMAIL_USER or GMAIL_APP_PASSWORD envs."
      );
    } else {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      const subject = `New Contact Message - ${name}`;
      const text = `You received a new contact message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const html = `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <pre style="white-space:pre-wrap;word-wrap:break-word;background:#f6f6f6;padding:12px;border-radius:8px">${message}</pre>
        </div>
      `;

      await transporter.sendMail({
        from: fromEmail,
        to: forwardTo,
        subject,
        text,
        html,
        replyTo: email,
      });
    }
  } catch (e) {
    console.error("Email send error:", e);
    // Do not fail the request if email sending fails; DB insert already succeeded
  }

  return NextResponse.json(
    { message: "Message submitted successfully!", data },
    { status: 200 }
  );
}
